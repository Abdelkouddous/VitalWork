import styled from "styled-components";

const Wrapper = styled.div`
  max-width: var(--max-width, 1120px);
  margin: 0 auto;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* ── 1. Header Card ── */
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
    margin-bottom: 0.5rem;
  }

  .institution-badge {
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

  .location-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-secondary-color);
    font-family: monospace;
  }

  .clinic-title {
    font-size: 1.625rem;
    font-weight: 700;
    letter-spacing: var(--letter-spacing);
    color: var(--text-color);
    margin: 0 0 0.375rem 0;
  }

  .clinic-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary-color);
    margin: 0;
    line-height: 1.5;
  }

  .action-btns {
    display: flex;
    flex-wrap: wrap;
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

  /* ── 2. 6-Card KPI Grid ── */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1200px) {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .kpi-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.125rem 1.25rem;
    box-shadow: var(--shadow-1);
    transition: var(--transition);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2);
      border-color: var(--primary-500);
    }

    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.625rem;
    }

    .kpi-name {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary-color);
    }

    .kpi-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: calc(var(--border-radius) - 4px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;

      &.teal {
        background: rgba(0, 194, 168, 0.12);
        color: var(--primary-500);
      }
      &.blue {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;
      }
      &.purple {
        background: rgba(139, 92, 246, 0.12);
        color: #8b5cf6;
      }
      &.amber {
        background: rgba(245, 158, 11, 0.12);
        color: #f59e0b;
      }
      &.emerald {
        background: rgba(16, 185, 129, 0.12);
        color: #10b981;
      }
      &.rose {
        background: rgba(244, 63, 94, 0.12);
        color: #f43f5e;
      }
    }

    .kpi-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.25rem 0;
      line-height: 1.2;
    }

    .kpi-subtitle {
      font-size: 0.6875rem;
      font-weight: 500;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &.teal { color: var(--primary-500); }
      &.blue { color: #3b82f6; }
      &.purple { color: #8b5cf6; }
      &.amber { color: #f59e0b; }
      &.emerald { color: #10b981; }
      &.rose { color: #f43f5e; }
    }
  }

  /* ── 3. Visual Analytics Charts Grid ── */
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .chart-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-1);

    .chart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .chart-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
    }

    .chart-subtitle {
      font-size: 0.75rem;
      color: var(--text-secondary-color);
      margin: 0.25rem 0 0 0;
    }

    .chart-tag {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;

      &.teal {
        background: rgba(0, 194, 168, 0.12);
        color: var(--primary-500);
      }
      &.purple {
        background: rgba(139, 92, 246, 0.12);
        color: #8b5cf6;
      }
    }

    .chart-container {
      width: 100%;
      height: 260px;
    }
  }

  /* ── 4. Candidate Submissions Table Card ── */
  .table-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-1);

    .card-top {
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
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-500);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .table-wrap {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      font-size: 0.8125rem;
      border-collapse: collapse;
      text-align: left;

      th {
        padding-bottom: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary-color);
        border-bottom: 1px solid var(--border-color);

        &.text-right {
          text-align: right;
        }
      }

      td {
        padding: 0.875rem 0;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-color);

        &.sub-text {
          color: var(--text-secondary-color);
        }

        &.text-right {
          text-align: right;
        }
      }

      tbody tr:hover {
        background: var(--surface-secondary, rgba(0, 0, 0, 0.02));
      }
    }

    .status-pill {
      display: inline-block;
      padding: 0.2rem 0.625rem;
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

      &.applied,
      &.pending {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.25);
      }
    }

    .action-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-500);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .empty-box {
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

  /* ── 5. Hospital Roster Card ── */
  .roster-card {
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-1);

    .roster-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .roster-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
    }

    .roster-subtitle {
      font-size: 0.75rem;
      color: var(--text-secondary-color);
      margin: 0.25rem 0 0 0;
    }

    .manage-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-500);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .roster-grid {
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

    .roster-item {
      padding: 0.875rem 1rem;
      border-radius: var(--border-radius);
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .job-title {
        font-size: 0.8125rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0 0 0.25rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .job-meta {
        font-size: 0.6875rem;
        color: var(--text-secondary-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .roster-footer {
        margin-top: 0.75rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.6875rem;

        .active-badge {
          color: var(--primary-500);
          font-weight: 600;
        }

        .edit-link {
          color: var(--text-secondary-color);
          text-decoration: none;

          &:hover {
            color: var(--primary-500);
          }
        }
      }
    }
  }
`;

export default Wrapper;
