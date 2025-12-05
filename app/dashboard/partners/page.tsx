'use client';

import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, XCircle, Pause, Play, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminService, Partner } from '@/lib/api/admin';
import { formatDate } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Form state for approve dialog
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(100);
  const [rateLimitPerDay, setRateLimitPerDay] = useState(10000);
  const [approveNotes, setApproveNotes] = useState('');
  
  // Form state for suspend dialog
  const [suspendReason, setSuspendReason] = useState('');
  
  // Form state for reject dialog
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadPartners();
  }, [page, statusFilter]);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      
      // Map filter to backend status filter
      const statusMap: Record<string, string | undefined> = {
        'all': undefined,
        'pending': 'pending_approval',
        'active': 'active',
        'suspended': 'suspended',
        'rejected': 'rejected',
      };
      
      const data = await adminService.getAllPartners({
        page,
        page_size: pageSize,
        status_filter: statusMap[statusFilter],
      });
      
      setPartners(data.partners || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (error: any) {
      toast.error('Failed to load partners');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search partners (client-side search on loaded data)
  const filteredPartners = useMemo(() => {
    let filtered = partners;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.company_name.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          (p.business_type && p.business_type.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [partners, searchQuery]);

  const handleApprove = async () => {
    if (!selectedPartner) return;
    
    try {
      setActionLoading(selectedPartner.id);
      await adminService.approvePartner(selectedPartner.id, {
        action: 'approve',
        rate_limit_per_minute: rateLimitPerMinute,
        rate_limit_per_day: rateLimitPerDay,
        notes: approveNotes || undefined,
      });
      toast.success('Partner approved successfully');
      setApproveDialogOpen(false);
      resetApproveForm();
      loadPartners();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to approve partner');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedPartner) return;
    
    try {
      setActionLoading(selectedPartner.id);
      await adminService.rejectPartner(selectedPartner.id, {
        reason: rejectReason || undefined,
      });
      toast.success('Partner rejected successfully');
      setRejectDialogOpen(false);
      setRejectReason('');
      loadPartners();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reject partner');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async () => {
    if (!selectedPartner) return;
    
    if (!suspendReason || suspendReason.length < 10) {
      toast.error('Please provide a reason (minimum 10 characters)');
      return;
    }

    try {
      setActionLoading(selectedPartner.id);
      await adminService.suspendPartner(selectedPartner.id, suspendReason);
      toast.success('Partner suspended successfully');
      setSuspendDialogOpen(false);
      setSuspendReason('');
      loadPartners();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to suspend partner');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (partnerId: string) => {
    try {
      setActionLoading(partnerId);
      await adminService.activatePartner(partnerId);
      toast.success('Partner activated successfully');
      loadPartners();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to activate partner');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewPartner = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (partner) {
      setSelectedPartner(partner);
      setViewDialogOpen(true);
    }
  };

  const resetApproveForm = () => {
    setRateLimitPerMinute(100);
    setRateLimitPerDay(10000);
    setApproveNotes('');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending_verification: { label: 'Pending Verification', className: 'bg-yellow-100 text-yellow-700' },
      pending_approval: { label: 'Pending Approval', className: 'bg-orange-100 text-orange-700' },
      active: { label: 'Active', className: 'bg-green-100 text-green-700' },
      suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700' },
      rejected: { label: 'Rejected', className: 'bg-gray-100 text-gray-700' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ovu-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-ovu-primary"
            >
              <option value="all">All Partners</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partners..."
              className="h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-ovu-primary"
            />
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Business Type</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No partners found
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id}>
                    <td className="font-medium">{partner.company_name}</td>
                    <td>{partner.email}</td>
                    <td className="capitalize">{partner.business_type?.replace('_', ' ') || 'N/A'}</td>
                    <td>{getStatusBadge(partner.status)}</td>
                    <td>{formatDate(partner.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {partner.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedPartner(partner);
                                resetApproveForm();
                                setApproveDialogOpen(true);
                              }}
                              disabled={actionLoading === partner.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title="Approve"
                            >
                              {actionLoading === partner.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPartner(partner);
                                setRejectReason('');
                                setRejectDialogOpen(true);
                              }}
                              disabled={actionLoading === partner.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title="Reject"
                            >
                              {actionLoading === partner.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                            </button>
                          </>
                        )}
                        {partner.status === 'active' && (
                          <button
                            onClick={() => {
                              setSelectedPartner(partner);
                              setSuspendReason('');
                              setSuspendDialogOpen(true);
                            }}
                            disabled={actionLoading === partner.id}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Suspend"
                          >
                            {actionLoading === partner.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Pause className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        {partner.status === 'suspended' && (
                          <button
                            onClick={() => handleActivate(partner.id)}
                            disabled={actionLoading === partner.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Activate"
                          >
                            {actionLoading === partner.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleViewPartner(partner.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages} • Showing {filteredPartners.length} of {total} partners
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog.Root open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              Approve Partner
            </Dialog.Title>
            {selectedPartner && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="font-medium">{selectedPartner.company_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit (per minute)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={rateLimitPerMinute}
                    onChange={(e) => setRateLimitPerMinute(parseInt(e.target.value) || 100)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit (per day)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    value={rateLimitPerDay}
                    onChange={(e) => setRateLimitPerDay(parseInt(e.target.value) || 10000)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={approveNotes}
                    onChange={(e) => setApproveNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    placeholder="Add any notes..."
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading === selectedPartner.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-ovu-primary hover:bg-ovu-secondary rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === selectedPartner.id ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Approving...
                      </span>
                    ) : (
                      'Approve'
                    )}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reject Dialog */}
      <Dialog.Root open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              Reject Partner
            </Dialog.Title>
            {selectedPartner && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="font-medium">{selectedPartner.company_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (optional)
                  </label>
                  <textarea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    placeholder="Provide a reason for rejection..."
                    maxLength={500}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading === selectedPartner.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === selectedPartner.id ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Rejecting...
                      </span>
                    ) : (
                      'Reject'
                    )}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Suspend Dialog */}
      <Dialog.Root open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              Suspend Partner
            </Dialog.Title>
            {selectedPartner && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="font-medium">{selectedPartner.company_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    placeholder="Provide a reason for suspension (minimum 10 characters)..."
                    minLength={10}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {suspendReason.length}/500 characters (minimum 10 required)
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleSuspend}
                    disabled={actionLoading === selectedPartner.id || suspendReason.length < 10}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === selectedPartner.id ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Suspending...
                      </span>
                    ) : (
                      'Suspend'
                    )}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* View Partner Details Dialog */}
      <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              Partner Details
            </Dialog.Title>
            {selectedPartner && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company Name</p>
                    <p className="font-medium">{selectedPartner.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium">{selectedPartner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Business Type</p>
                    <p className="font-medium capitalize">{selectedPartner.business_type?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div>{getStatusBadge(selectedPartner.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Registered</p>
                    <p className="font-medium">{formatDate(selectedPartner.created_at)}</p>
                  </div>
                  {selectedPartner.name && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-medium">{selectedPartner.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
