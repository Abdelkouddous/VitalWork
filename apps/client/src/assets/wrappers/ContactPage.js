import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  background: var(--background-color);
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;

  .bg-blob-1 {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 30vw;
    height: 30vw;
    border-radius: 50%;
    background: var(--primary-500);
    opacity: 0.03;
    filter: blur(80px);
    pointer-events: none;
  }

  .bg-blob-2 {
    position: absolute;
    bottom: -10%;
    right: -10%;
    width: 35vw;
    height: 35vw;
    border-radius: 50%;
    background: var(--primary-500);
    opacity: 0.04;
    filter: blur(80px);
    pointer-events: none;
  }

  .contact-container {
    max-width: 64rem;
    width: 100%;
    background: var(--background-secondary-color);
    border-radius: 1.5rem;
    box-shadow: var(--shadow-3);
    overflow: hidden;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
    z-index: 10;
  }

  .info-column {
    padding: 2.5rem;
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
    color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .info-grid-overlay {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .info-title {
    font-size: 2.25rem;
    font-weight: 750;
    letter-spacing: -0.025em;
    margin-bottom: 1rem;
    color: var(--white);
    line-height: 1.2;
  }

  .info-desc {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    line-height: 1.625;
    margin-bottom: 2.5rem;
    text-align: left;
  }

  .info-items {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .icon-wrapper {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: var(--shadow-1);
    transition: background-color 0.3s ease;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .info-detail {
    padding-top: 0.25rem;

    .item-label {
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.25rem;
    }

    .item-value {
      font-size: 1rem;
      font-weight: 500;
      color: var(--white);

      &.clickable:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .footer-text {
    margin-top: 3rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.4);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    position: relative;
    z-index: 10;
  }

  .form-column {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-title {
    font-size: 1.875rem;
    font-weight: 800;
    color: var(--text-color);
    letter-spacing: -0.025em;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  .form-desc {
    color: var(--text-secondary-color);
    margin-bottom: 2rem;
    font-size: 1rem;
    text-align: left;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary-color);
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    &:focus-within label {
      color: var(--primary-500);
    }
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    background: var(--background-color);
    color: var(--text-color);
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-1);

    &::placeholder {
      color: rgba(140, 160, 179, 0.5);
    }

    &:focus {
      outline: none;
      border-color: transparent;
      box-shadow: 0 0 0 2px var(--primary-500);
    }
  }

  .form-textarea {
    resize: none;
    height: 8rem;
  }

  .submit-btn {
    width: 100%;
    background: var(--primary-500);
    color: var(--white);
    padding: 1rem;
    border-radius: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 15px -3px rgba(0, 194, 168, 0.15);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    &:hover {
      background: var(--primary-600);
    }

    &:active {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
`;

export default Wrapper;
