import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;

  .user-bar-btn {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background: var(--background-secondary-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 0.375rem 0.75rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: var(--transition);
    box-shadow: var(--shadow-1);

    &:hover {
      background: var(--surface-secondary);
      border-color: var(--primary-500);
      color: var(--primary-500);
      transform: translateY(-1px);
    }
  }

  .avatar-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--primary-500);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
    box-shadow: 0 0 0 2px rgba(0, 194, 168, 0.2);
  }

  .status-dot {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 9px;
    height: 9px;
    background: #10b981;
    border: 2px solid var(--background-secondary-color);
    border-radius: 50%;
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.25;

    .user-name {
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.8125rem;
      max-width: 130px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.6875rem;
      color: var(--primary-500);
      font-weight: 500;
      text-transform: capitalize;
    }
  }

  .caret-icon {
    font-size: 0.75rem;
    color: var(--text-secondary-color);
    transition: transform 0.2s ease;
  }

  .caret-rotate {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 230px;
    background: var(--surface-primary, var(--background-secondary-color));
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-3);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-8px);
    transition: all 0.2s ease-in-out;
    z-index: 1200;
  }

  .show-dropdown {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  .dropdown-header {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0.375rem;

    .header-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-email {
      font-size: 0.6875rem;
      color: var(--text-secondary-color);
      margin: 0.125rem 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-badge {
      display: inline-block;
      margin-top: 0.375rem;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.625rem;
      font-weight: 600;
      background: rgba(0, 194, 168, 0.12);
      color: var(--primary-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--border-radius) - 4px);
    background: transparent;
    border: none;
    color: var(--text-color);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: var(--transition);
    text-align: left;

    svg {
      font-size: 1rem;
      color: var(--text-secondary-color);
      transition: color 0.2s ease;
      flex-shrink: 0;
    }

    &:hover {
      background: var(--surface-secondary, var(--grey-100));
      color: var(--primary-500);

      svg {
        color: var(--primary-500);
      }
    }

    &.logout {
      color: var(--red-dark, #ef4444);
      border-top: 1px solid var(--border-color);
      margin-top: 0.375rem;
      padding-top: 0.625rem;

      svg {
        color: var(--red-dark, #ef4444);
      }

      &:hover {
        background: rgba(239, 68, 68, 0.08);
        color: var(--red-dark, #ef4444);
      }
    }
  }
`;

export default Wrapper;
