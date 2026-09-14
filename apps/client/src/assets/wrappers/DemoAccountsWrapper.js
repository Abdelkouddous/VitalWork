import styled from "styled-components";

const Wrapper = styled.section`
  padding: 5rem 1.5rem;
  background: var(--background-secondary-color);
  position: relative;
  overflow: hidden;

  .inner-container {
    max-width: var(--max-width, 1120px);
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 3.5rem auto;
  }

  .sandbox-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    border: 1px solid rgba(0, 194, 168, 0.3);
    background: rgba(0, 194, 168, 0.1);
    color: var(--primary-500);
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: var(--letter-spacing);
    color: var(--text-color);

    @media (min-width: 768px) {
      font-size: 2.25rem;
    }
  }

  .section-desc {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-secondary-color);
    margin: 0;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .demo-card {
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius);
    padding: 1.75rem;
    background: var(--surface-primary);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-1);
    transition: var(--transition);
    position: relative;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-3);
      border-color: var(--primary-500);
    }

    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .role-icon-box {
      padding: 0.75rem;
      border-radius: calc(var(--border-radius) - 2px);
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &.admin {
        color: #8b5cf6;
      }
      &.clinic {
        color: var(--primary-500);
      }
      &.jobseeker {
        color: #3b82f6;
      }
    }

    .role-badge {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      border: 1px solid transparent;

      &.admin {
        background: rgba(139, 92, 246, 0.12);
        color: #8b5cf6;
        border-color: rgba(139, 92, 246, 0.25);
      }
      &.clinic {
        background: rgba(0, 194, 168, 0.12);
        color: var(--primary-500);
        border-color: rgba(0, 194, 168, 0.25);
      }
      &.jobseeker {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;
        border-color: rgba(59, 130, 246, 0.25);
      }
    }

    .role-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    .role-desc {
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--text-secondary-color);
      margin: 0 0 1.25rem 0;
      flex-grow: 0;
    }

    .credentials-box {
      border-radius: calc(var(--border-radius) - 2px);
      padding: 0.875rem 1rem;
      margin-bottom: 1.25rem;
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .cred-row {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.divider {
          border-top: 1px solid var(--border-color);
          padding-top: 0.5rem;
        }
      }

      .cred-label {
        color: var(--text-secondary-color);
        font-weight: 500;
      }

      .cred-value-wrap {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-family: monospace;
        color: var(--text-color);
        font-weight: 600;
        max-width: 180px;

        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary-color);
          padding: 0.125rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;

          &:hover {
            color: var(--primary-500);
          }
        }
      }
    }

    .features-wrap {
      margin-bottom: 1.5rem;
      flex-grow: 1;

      .features-heading {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary-color);
        display: block;
        margin-bottom: 0.5rem;
      }

      .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--text-secondary-color);

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--primary-500);
          flex-shrink: 0;
        }
      }
    }

    .actions-box {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);

      .btn-autologin {
        width: 100%;
        padding: 0.625rem 1rem;
        border-radius: var(--border-radius);
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--white);
        background: var(--primary-500);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        box-shadow: var(--shadow-1);
        transition: var(--transition);

        &:hover {
          background: var(--primary-600);
          transform: translateY(-1px);
          box-shadow: var(--shadow-2);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .btn-wizard {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border-radius: var(--border-radius);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-secondary-color);
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        cursor: pointer;
        transition: var(--transition);

        &:hover {
          background: var(--background-secondary-color);
          color: var(--text-color);
        }
      }
    }
  }
`;

export default Wrapper;
