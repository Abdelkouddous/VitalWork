import React from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import styled from "styled-components";

const ThemeToggle = () => {
  const { theme, changeTheme } = useTheme();

  return (
    <SelectWrapper>
      <div className="icon-indicator">
        {theme === "light" && <Sun className="h-4 w-4 icon" />}
        {theme === "dark" && <Moon className="h-4 w-4 icon" />}
        {theme === "system" && <Monitor className="h-4 w-4 icon-secondary" />}
      </div>
      <select
        value={theme}
        onChange={(e) => changeTheme(e.target.value)}
        aria-label="Select system theme preference"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <ChevronDown className="h-3.5 w-3.5 chevron" />
    </SelectWrapper>
  );
};

const SelectWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  padding: 0.375rem 0.625rem;
  border-radius: 8px;
  position: relative;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--primary-500);
  }

  .icon-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    
    .icon {
      color: var(--primary-500);
    }
    
    .icon-secondary {
      color: var(--text-secondary-color);
    }
  }

  select {
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    appearance: none;
    padding-right: 1.25rem; /* space for custom chevron */
    margin: 0;
    width: 100%;
    
    option {
      background: var(--background-color);
      color: var(--text-color);
      font-weight: 600;
    }
  }

  .chevron {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary-color);
    pointer-events: none;
  }
`;

export default ThemeToggle;
