import styled from "styled-components";

const Wrapper = styled.section`
  padding: 1.5rem;
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height) - 4rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .admin-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .admin-title-area {
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    p {
      color: var(--text-secondary-color);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  .admin-sync-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    background: var(--background-secondary-color);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    color: var(--text-color);
  }

  .admin-tab-container {
    animation: fadeInUp 0.4s ease forwards;
  }

  /* Grid layouts */
  .grid-4 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .grid-2-3 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;
    }
  }

  /* Cards */
  .admin-card {
    background: var(--background-secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow-1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2);
    }

    &.gradient-primary {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: var(--white);
      border: none;
      position: relative;
      overflow: hidden;
      
      h3, p, span {
        color: var(--white);
      }
      
      .card-icon-bg {
        background: rgba(255, 255, 255, 0.2);
        color: var(--white);
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .card-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-icon-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: var(--background-color);
    color: var(--primary-500);
    border: 1px solid var(--border-color);
  }

  /* Filter Panel */
  .filter-panel {
    background: var(--background-secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    
    input {
      width: 100%;
      padding: 0.625rem 1rem 0.625rem 2.5rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: var(--background-color);
      color: var(--text-color);
      font-size: 0.875rem;
      outline: none;
      transition: border-color var(--transition-fast);

      &:focus {
        border-color: var(--primary-500);
      }
    }

    svg {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary-color);
    }
  }

  .filter-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;

    span {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-secondary-color);
    }

    select {
      background: var(--background-color);
      color: var(--text-color);
      padding: 0.625rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      font-size: 0.875rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;

      &:focus {
        border-color: var(--primary-500);
      }
    }
  }

  /* Tables */
  .table-container {
    background: var(--background-secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-1);
  }

  .table-responsive {
    overflow-x: auto;
    width: 100%;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.8125rem;

    th {
      background: var(--background-secondary-color);
      color: var(--text-secondary-color);
      font-weight: 600;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover td {
      background: rgba(0, 0, 0, 0.02);
    }
  }
  
  .dark-theme & {
    .admin-table tbody tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
  }

  /* Forms & Inputs */
  .admin-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Custom badge statuses */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    
    &.pending {
      background-color: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    &.approved, &.active {
      background-color: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    &.blocked, &.suspended {
      background-color: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    &.unverified {
      background-color: rgba(100, 116, 139, 0.15);
      color: #64748b;
      border: 1px solid rgba(100, 116, 139, 0.3);
    }

    &.premium {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: var(--white);
      border: none;
      box-shadow: var(--shadow-1);
    }
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default Wrapper;
