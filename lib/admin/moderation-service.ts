// Content Moderation Service
// Handles AI-powered content moderation and review

import { createServerClient } from '@/lib/supabase/server';

export interface ModerationItem {
  id: string;
  contentType: string;
  contentId: string;
  contentData: any;
  reportedBy?: string;
  reportReason?: string;
  reportDescription?: string;
  aiFlagged: boolean;
  aiConfidence: number;
  aiFlags: any;
  status: string;
  priority: string;
  createdAt: string;
}

export interface ModerationAction {
  itemId: string;
  reviewerId: string;
  decision: 'approve' | 'reject' | 'escalate';
  notes: string;
  actionTaken: string;
}

class ModerationService {
  /**
   * Get moderation queue
   */
  async getModerationQueue(filters: {
    status?: string;
    priority?: string;
    contentType?: string;
    assignedTo?: string;
  }): Promise<ModerationItem[]> {
    const supabase = await createServerClient();
    
    let query = supabase
      .from('content_moderation')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.contentType) {
      query = query.eq('content_type', filters.contentType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      contentType: item.content_type,
      contentId: item.content_id,
      contentData: item.content_data,
      reportedBy: item.reported_by,
      reportReason: item.report_reason,
      reportDescription: item.report_description,
      aiFlagged: item.ai_flagged,
      aiConfidence: item.ai_confidence,
      aiFlags: item.ai_flags,
      status: item.status,
      priority: item.priority,
      createdAt: item.created_at
    }));
  }

  /**
   * Review content
   */
  async reviewContent(action: ModerationAction): Promise<boolean> {
    const supabase = await createServerClient();
    
    const status = action.decision === 'approve' ? 'approved' : 
                   action.decision === 'reject' ? 'rejected' : 
                   'escalated';
    
    const { error } = await supabase
      .from('content_moderation')
      .update({
        status,
        reviewed_by: action.reviewerId,
        reviewed_at: new Date().toISOString(),
        admin_notes: action.notes,
        action_taken: action.actionTaken
      })
      .eq('id', action.itemId);
    
    if (error) throw error;
    
    // Take action on the actual content
    if (action.decision === 'reject') {
      await this.takeContentAction(action.itemId, action.actionTaken);
    }
    
    return true;
  }

  /**
   * Flag content using AI
   */
  async flagContent(
    contentType: string,
    contentId: string,
    contentData: any
  ): Promise<boolean> {
    const supabase = await createServerClient();
    
    // Simulate AI moderation
    const aiResult = await this.performAIModeration(contentData);
    
    if (aiResult.flagged) {
      await supabase.from('content_moderation').insert({
        content_type: contentType,
        content_id: contentId,
        content_data: contentData,
        ai_flagged: true,
        ai_confidence: aiResult.confidence,
        ai_flags: aiResult.flags,
        status: 'pending',
        priority: aiResult.priority
      });
      
      return true;
    }
    
    return false;
  }

  /**
   * Report content by user
   */
  async reportContent(
    contentType: string,
    contentId: string,
    reportedBy: string,
    reason: string,
    description: string
  ): Promise<boolean> {
    const supabase = await createServerClient();
    
    const { error } = await supabase.from('content_moderation').insert({
      content_type: contentType,
      content_id: contentId,
      reported_by: reportedBy,
      report_reason: reason,
      report_description: description,
      status: 'pending',
      priority: this.determinePriority(reason)
    });
    
    return !error;
  }

  /**
   * Perform AI moderation (simulated)
   */
  private async performAIModeration(content: any): Promise<{
    flagged: boolean;
    confidence: number;
    flags: any;
    priority: string;
  }> {
    // In production, use actual AI moderation API
    // For MVP, return safe result
    return {
      flagged: false,
      confidence: 0.95,
      flags: {
        adult: { flagged: false, confidence: 0.01 },
        violence: { flagged: false, confidence: 0.01 },
        inappropriate: { flagged: false, confidence: 0.02 }
      },
      priority: 'low'
    };
  }

  /**
   * Take action on flagged content
   */
  private async takeContentAction(itemId: string, action: string): Promise<void> {
    // Implement content actions:
    // - content_removed
    // - user_warned
    // - user_suspended
    // - content_edited
    console.log(`Taking action: ${action} on item ${itemId}`);
  }

  /**
   * Determine priority based on report reason
   */
  private determinePriority(reason: string): string {
    const highPriority = ['violence', 'harassment', 'illegal'];
    const mediumPriority = ['inappropriate', 'spam', 'misleading'];
    
    if (highPriority.some(p => reason.toLowerCase().includes(p))) {
      return 'high';
    }
    if (mediumPriority.some(p => reason.toLowerCase().includes(p))) {
      return 'medium';
    }
    return 'low';
  }
}

export const moderationService = new ModerationService();
