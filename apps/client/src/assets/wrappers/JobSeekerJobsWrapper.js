import styled from "styled-components";

const Wrapper = styled.section`
  padding: 2rem;
  max-width: 1240px;
  margin: 0 auto;

  /* ── 1. GUEST BANNER ── */
  .guest-banner {
    margin-bottom: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: rgba(0, 194, 168, 0.08);
    border: 1px solid rgba(0, 194, 168, 0.25);

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .guest-banner-text {
    color: var(--primary-500, #00c2a8);
    font-weight: 500;
    font-size: 0.95rem;
    margin: 0;
  }

  .guest-banner-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  /* ── 2. PAGE HEADER ── */
  .header-section {
    margin-bottom: 2rem;
  }

  .header-top {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-color, #0f172a);
    margin: 0 0 0.35rem 0;
  }

  .page-subtitle {
    color: var(--text-secondary-color, #64748b);
    font-size: 0.95rem;
    margin: 0;
  }

  .jobs-counter {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    background: var(--surface-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    box-shadow: var(--shadow-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color, #0f172a);

    svg {
      color: var(--primary-500, #00c2a8);
    }
  }

  /* ── 3. SEARCH & FILTER BAR ── */
  .search-card {
    padding: 1rem 1.25rem;
    border-radius: 14px;
    background: var(--surface-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    box-shadow: var(--shadow-1, 0 1px 3px rgba(0, 0, 0, 0.05));
  }

  .search-row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
    }
  }

  .search-input-wrapper {
    position: relative;
    flex: 1;

    svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary-color, #94a3b8);
      font-size: 1.2rem;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.85rem;
      border-radius: 10px;
      border: 1px solid var(--border-color, #cbd5e1);
      background: var(--background-secondary-color, #f8fafc);
      color: var(--text-color, #0f172a);
      font-size: 0.95rem;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-500, #00c2a8);
        box-shadow: 0 0 0 3px rgba(0, 194, 168, 0.15);
        background: var(--surface-primary, #ffffff);
      }
    }
  }

  .sort-select {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--border-color, #cbd5e1);
    background: var(--background-secondary-color, #f8fafc);
    color: var(--text-color, #0f172a);
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 170px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: var(--primary-500, #00c2a8);
    }
  }

  /* ── 4. TWO-COLUMN LAYOUT: SIDEBAR + JOBS ── */
  .layout-grid {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  .sidebar-filter {
    width: 100%;

    @media (min-width: 1024px) {
      width: 270px;
      flex-shrink: 0;
      position: sticky;
      top: 5rem;
    }
  }

  .filter-box {
    background: var(--surface-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: var(--shadow-1, 0 1px 3px rgba(0, 0, 0, 0.05));
  }

  .filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color, #f1f5f9);

    h3 {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-color, #0f172a);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;

      svg {
        color: var(--primary-500, #00c2a8);
      }
    }

    button {
      background: none;
      border: none;
      color: var(--primary-500, #00c2a8);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .filter-group {
    margin-bottom: 1.25rem;

    label {
      display: block;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-secondary-color, #64748b);
      margin-bottom: 0.4rem;
    }

    select,
    input {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      border: 1px solid var(--border-color, #cbd5e1);
      background: var(--background-secondary-color, #f8fafc);
      color: var(--text-color, #0f172a);
      font-size: 0.88rem;

      &:focus {
        outline: none;
        border-color: var(--primary-500, #00c2a8);
      }
    }
  }

  /* ── 5. JOBS FEED & CARDS ── */
  .jobs-feed {
    flex: 1;
    min-width: 0;
  }

  .jobs-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .job-card {
    background: var(--surface-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 16px;
    padding: 1.35rem 1.5rem;
    box-shadow: var(--shadow-1, 0 1px 3px rgba(0, 0, 0, 0.05));
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-3, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      border-color: rgba(0, 194, 168, 0.4);
    }
  }

  .job-card-main {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  .job-details-col {
    flex: 1;
    min-width: 0;
  }

  .job-top-row {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .hospital-icon-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(0, 194, 168, 0.15) 0%, rgba(13, 148, 136, 0.25) 100%);
    color: var(--primary-500, #00c2a8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .job-heading-wrap {
    flex: 1;
    min-width: 0;
  }

  .job-position {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-color, #0f172a);
    margin: 0 0 0.25rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .job-hospital-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.75rem;
    font-size: 0.88rem;
    color: var(--text-secondary-color, #64748b);
  }

  .hospital-name {
    font-weight: 600;
    color: var(--primary-600, #00c2a8);
  }

  .bookmark-btn {
    background: none;
    border: none;
    color: var(--text-secondary-color, #94a3b8);
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.2rem;
    transition: all 0.2s ease;

    &:hover {
      color: var(--primary-500, #00c2a8);
    }

    &.saved {
      color: var(--primary-500, #00c2a8);
    }
  }

  .pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.75rem 0 0.75rem 4rem;
  }

  .specialty-pill {
    padding: 0.25rem 0.65rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    background: rgba(0, 194, 168, 0.12);
    color: var(--primary-500, #00c2a8);
  }

  .type-pill {
    padding: 0.25rem 0.65rem;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    background: var(--surface-secondary, #f1f5f9);
    color: var(--text-secondary-color, #475569);
  }

  .job-snippet {
    margin: 0 0 0 4rem;
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--text-secondary-color, #475569);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── 6. CARD ACTION COLUMN ── */
  .card-action-col {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color, #f1f5f9);

    @media (min-width: 768px) {
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      margin-top: 0;
      padding-top: 0;
      border-top: none;
      min-width: 150px;
    }
  }

  .action-btn-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: column;
      width: 100%;
    }
  }

  .btn-details {
    flex: 1;
    padding: 0.55rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    background: transparent;
    border: 1px solid var(--border-color, #cbd5e1);
    color: var(--text-color, #1e293b);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
      background: var(--surface-secondary, #f1f5f9);
      border-color: var(--primary-400, #2dd4bf);
      color: var(--primary-600, #00c2a8);
    }
  }

  .btn-apply-card {
    flex: 1;
    padding: 0.55rem 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    border: none;
    background: linear-gradient(135deg, var(--primary-500, #00c2a8) 0%, #0d9488 100%);
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 194, 168, 0.3);
    width: 100%;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 194, 168, 0.4);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &.applied {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.25);
      box-shadow: none;
      cursor: default;
    }
  }

  .card-salary-box {
    text-align: right;
    display: flex;
    flex-direction: column;
  }

  .card-salary-label {
    font-size: 0.72rem;
    color: var(--text-secondary-color, #94a3b8);
    text-transform: uppercase;
    font-weight: 600;
  }

  .card-salary-val {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-color, #0f172a);
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }

  .card-date-posted {
    font-size: 0.78rem;
    color: var(--text-secondary-color, #94a3b8);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* ── 7. EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 4rem 1.5rem;
    background: var(--surface-primary, #ffffff);
    border: 1px dashed var(--border-color, #cbd5e1);
    border-radius: 16px;

    svg {
      font-size: 3.5rem;
      color: var(--text-secondary-color, #94a3b8);
      margin-bottom: 1rem;
      opacity: 0.4;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color, #0f172a);
      margin: 0 0 0.5rem 0;
    }

    p {
      color: var(--text-secondary-color, #64748b);
      margin: 0 0 1.25rem 0;
    }
  }

  /* ── 8. PAGINATION ── */
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .page-num-btn {
    min-width: 38px;
    height: 38px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--border-color, #cbd5e1);
    background: var(--surface-primary, #ffffff);
    color: var(--text-color, #0f172a);

    &:hover {
      border-color: var(--primary-400, #2dd4bf);
      color: var(--primary-600, #00c2a8);
    }

    &.active {
      background: var(--primary-500, #00c2a8);
      color: #ffffff;
      border-color: var(--primary-500, #00c2a8);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;

export default Wrapper;
