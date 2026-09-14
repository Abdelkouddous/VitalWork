import styled from "styled-components";

const Wrapper = styled.div`
  max-width: var(--max-width, 1120px);
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* ── Header Card ── */
  .header-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.75rem 2rem;
    box-shadow: var(--shadow-1);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .badge-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.625rem;
  }

  .clinical-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(0, 194, 168, 0.12);
    color: var(--primary-500);
    border: 1px solid rgba(0, 194, 168, 0.25);
  }

  .specialty-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(59, 130, 246, 0.12);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.25);
  }

  .wilaya-tag {
    font-size: 0.75rem;
    color: var(--text-secondary-color);
    font-family: monospace;
    margin-left: 0.25rem;
  }

  .welcome-title {
    font-size: 1.625rem;
    font-weight: 700;
    letter-spacing: var(--letter-spacing);
    color: var(--text-color);
    margin: 0 0 0.375rem 0;

    .doctor-name {
      color: var(--primary-500);
    }
  }

  .welcome-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary-color);
    margin: 0;
    line-height: 1.5;
  }

  .action-btns {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.125rem;
      border-radius: var(--border-radius);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--white);
      background: var(--primary-500);
      border: none;
      text-decoration: none;
      box-shadow: var(--shadow-1);
      transition: var(--transition);
      cursor: pointer;

      &:hover {
        background: var(--primary-600);
        transform: translateY(-1px);
        box-shadow: var(--shadow-2);
      }
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.125rem;
      border-radius: var(--border-radius);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-color);
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      text-decoration: none;
      transition: var(--transition);
      cursor: pointer;

      &:hover {
        background: var(--surface-secondary);
        border-color: var(--primary-500);
        color: var(--primary-500);
      }
    }
  }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (min-width: 992px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .kpi-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow-1);
    transition: var(--transition);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2);
      border-color: var(--primary-500);
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .kpi-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary-color);
    }

    .kpi-icon-box {
      width: 38px;
      height: 38px;
      border-radius: calc(var(--border-radius) - 2px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;

      &.teal {
        background: rgba(0, 194, 168, 0.12);
        color: var(--primary-500);
      }
      &.purple {
        background: rgba(139, 92, 246, 0.12);
        color: #8b5cf6;
      }
      &.blue {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;
      }
      &.green {
        background: rgba(16, 185, 129, 0.12);
        color: #10b981;
      }
    }

    .kpi-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
      line-height: 1.2;
    }

    .kpi-trend {
      font-size: 0.75rem;
      font-weight: 500;
      margin: 0;

      &.teal { color: var(--primary-500); }
      &.purple { color: #8b5cf6; }
      &.blue { color: #3b82f6; }
      &.green { color: #10b981; }
    }
  }

  /* ── Verification Banner Card ── */
  .verification-card {
    background: linear-gradient(135deg, rgba(0, 194, 168, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%);
    border: 1px solid rgba(0, 194, 168, 0.25);
    border-radius: var(--border-radius);
    padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow-1);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .verification-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .shield-box {
      width: 44px;
      height: 44px;
      border-radius: var(--border-radius);
      background: rgba(0, 194, 168, 0.18);
      color: var(--primary-500);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .verification-text {
      h3 {
        font-size: 0.9375rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0;

        .status-tag {
          color: var(--primary-500);
          font-weight: 600;
        }
      }

      p {
        font-size: 0.75rem;
        color: var(--text-secondary-color);
        margin: 0.25rem 0 0 0;
      }
    }

    .badge-btn {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      border: 1px solid rgba(0, 194, 168, 0.3);
      color: var(--primary-500);
      background: var(--surface-primary, var(--white));
      text-decoration: none;
      white-space: nowrap;
      transition: var(--transition);

      &:hover {
        background: rgba(0, 194, 168, 0.1);
      }
    }
  }

  /* ── Recent Applications Card & Table ── */
  .table-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-1);

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.75rem;
      color: var(--text-secondary-color);
      margin: 0.25rem 0 0 0;
    }

    .view-all-link {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-500);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .table-container {
      overflow-x: auto;
    }

    .apps-table {
      width: 100%;
      font-size: 0.8125rem;
      border-collapse: collapse;

      th {
        text-align: left;
        padding-bottom: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary-color);
        border-bottom: 1px solid var(--border-color);
      }

      td {
        padding: 0.875rem 0;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-color);

        &.company-col {
          color: var(--text-secondary-color);
        }

        &.date-col {
          color: var(--text-secondary-color);
        }
      }

      tbody tr:hover {
        background: var(--surface-secondary, rgba(0, 0, 0, 0.02));
      }
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: capitalize;

      &.interview,
      &.accepted {
        background: rgba(0, 194, 168, 0.15);
        color: var(--primary-500);
        border: 1px solid rgba(0, 194, 168, 0.3);
      }

      &.declined,
      &.rejected {
        background: rgba(239, 68, 68, 0.12);
        color: var(--red-dark, #ef4444);
        border: 1px solid rgba(239, 68, 68, 0.25);
      }

      &.pending,
      &.applied {
        background: rgba(245, 158, 11, 0.12);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.25);
      }
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem 1rem;
      border: 1px dashed var(--border-color);
      border-radius: var(--border-radius);

      .empty-icon {
        font-size: 2.25rem;
        color: var(--text-secondary-color);
        opacity: 0.5;
        margin-bottom: 0.75rem;
      }

      .empty-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
      }

      .empty-desc {
        font-size: 0.75rem;
        color: var(--text-secondary-color);
        margin: 0.25rem 0 1rem 0;
      }
    }
  }

  /* ── Quick Links Hub Card ── */
  .hub-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-1);

    .hub-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 1rem 0;
    }

    .hub-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 992px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .hub-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: var(--border-radius);
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      color: var(--text-color);
      text-decoration: none;
      transition: var(--transition);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-1);
        border-color: var(--primary-500);
      }

      .hub-icon {
        width: 34px;
        height: 34px;
        border-radius: calc(var(--border-radius) - 4px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;

        &.teal {
          background: rgba(0, 194, 168, 0.12);
          color: var(--primary-500);
        }
        &.purple {
          background: rgba(139, 92, 246, 0.12);
          color: #8b5cf6;
        }
        &.amber {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
        }
        &.red {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }
      }

      .hub-text {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--text-color);
      }
    }
  }
`;

export default Wrapper;
