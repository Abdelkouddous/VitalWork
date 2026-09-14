import styled from "styled-components";

const Wrapper = styled.div`
  /* ── 1. MODAL BACKDROP OVERLAY ── */
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* ── 2. MODAL DIALOG CONTAINER ── */
  .modal-dialog {
    position: relative;
    width: 100%;
    max-width: 780px;
    max-height: 88vh;
    background: var(--background-secondary-color, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 18px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* ── 3. TOP ACTION CONTROLS ── */
  .modal-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem 0.5rem 1.5rem;
  }

  .top-badge-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .featured-tag {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.65rem;
    border-radius: 9999px;
    background: rgba(0, 194, 168, 0.12);
    color: var(--primary-500, #00c2a8);
  }

  .status-tag {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.65rem;
    border-radius: 9999px;
    background: var(--surface-secondary, #f1f5f9);
    color: var(--text-secondary-color, #64748b);
  }

  .top-btn-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--border-color, #e2e8f0);
    background: var(--surface-primary, #ffffff);
    color: var(--text-secondary-color, #64748b);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--surface-secondary, #f8fafc);
      color: var(--text-color, #1e293b);
      border-color: var(--primary-300, #5eead4);
    }

    &.saved {
      color: var(--primary-500, #00c2a8);
      background: rgba(0, 194, 168, 0.1);
      border-color: var(--primary-500, #00c2a8);
    }
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--border-color, #e2e8f0);
    background: var(--surface-primary, #ffffff);
    color: var(--text-secondary-color, #64748b);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }
  }

  /* ── 4. MODAL HERO / HEADER ── */
  .modal-hero {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 0.75rem 1.75rem 1.25rem 1.75rem;
    border-bottom: 1px solid var(--border-color, #e2e8f0);
  }

  .hospital-avatar {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--primary-500, #00c2a8) 0%, #0d9488 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 700;
    box-shadow: 0 8px 16px -4px rgba(0, 194, 168, 0.3);
    flex-shrink: 0;
  }

  .hero-meta {
    flex: 1;
    min-width: 0;
  }

  .job-title {
    font-size: 1.45rem;
    font-weight: 700;
    color: var(--text-color, #0f172a);
    margin: 0 0 0.35rem 0;
    line-height: 1.25;
  }

  .company-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    font-size: 0.95rem;
    color: var(--text-secondary-color, #475569);
    margin-bottom: 0.5rem;
  }

  .company-name {
    font-weight: 600;
    color: var(--primary-600, #00c2a8);
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--primary-500, #00c2a8);
    font-weight: 600;
  }

  .location-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .posting-timeline {
    font-size: 0.8rem;
    color: var(--text-secondary-color, #64748b);
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  /* ── 5. SCROLLABLE BODY CONTENT ── */
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    /* Custom sleek scrollbar */
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--border-color, #cbd5e1);
      border-radius: 9999px;
    }
  }

  /* ── 6. CLINICAL METRICS HIGHLIGHTS (PILLS) ── */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.85rem;
  }

  .metric-card {
    background: var(--surface-secondary, #f8fafc);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .metric-icon-box {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    flex-shrink: 0;

    &.teal {
      background: rgba(0, 194, 168, 0.15);
      color: var(--primary-500, #00c2a8);
    }
    &.blue {
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }
    &.green {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    &.amber {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }
  }

  .metric-data {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .metric-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--text-secondary-color, #64748b);
    margin-bottom: 0.15rem;
  }

  .metric-value {
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--text-color, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── 7. SECTIONS & TYPOGRAPHY ── */
  .details-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .section-heading {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-color, #0f172a);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--border-color, #e2e8f0);

    svg {
      color: var(--primary-500, #00c2a8);
    }
  }

  .section-text {
    font-size: 0.93rem;
    line-height: 1.65;
    color: var(--text-secondary-color, #334155);
    margin: 0;
    white-space: pre-line;
  }

  .checklist {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--text-secondary-color, #334155);

    svg {
      color: var(--primary-500, #00c2a8);
      font-size: 1.05rem;
      margin-top: 0.15rem;
      flex-shrink: 0;
    }
  }

  .hospital-info-box {
    background: var(--surface-secondary, #f8fafc);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hospital-info-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-color, #0f172a);
    margin: 0;
  }

  .hospital-info-desc {
    font-size: 0.88rem;
    color: var(--text-secondary-color, #64748b);
    line-height: 1.5;
    margin: 0;
  }

  /* ── 8. MODAL STICKY FOOTER ── */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.75rem;
    border-top: 1px solid var(--border-color, #e2e8f0);
    background: var(--surface-primary, #ffffff);
  }

  .footer-salary-info {
    display: flex;
    flex-direction: column;
  }

  .salary-label {
    font-size: 0.72rem;
    color: var(--text-secondary-color, #64748b);
    text-transform: uppercase;
    font-weight: 600;
  }

  .salary-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-color, #0f172a);
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .btn-dismiss {
    padding: 0.65rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 1px solid var(--border-color, #cbd5e1);
    background: transparent;
    color: var(--text-secondary-color, #475569);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--surface-secondary, #f1f5f9);
      color: var(--text-color, #1e293b);
    }
  }

  .btn-apply-modal {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.75rem;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    border: none;
    background: linear-gradient(135deg, var(--primary-500, #00c2a8) 0%, #0d9488 100%);
    color: #ffffff;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 194, 168, 0.35);
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 194, 168, 0.45);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
    }

    &.applied {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      box-shadow: none;
      cursor: default;
    }
  }

  @media (max-width: 640px) {
    padding: 0.5rem;

    .modal-hero {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
    }

    .modal-body {
      padding: 1rem 1.25rem;
    }

    .modal-footer {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
    }

    .footer-actions {
      display: flex;
      flex-direction: row;
      width: 100%;

      .btn-dismiss {
        flex: 1;
      }
      .btn-apply-modal {
        flex: 2;
        justify-content: center;
      }
    }
  }
`;

export default Wrapper;
