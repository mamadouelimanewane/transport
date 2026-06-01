import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOperator } from '../store/store';
import { OPERATORS } from '../data/transportData';

const ALL = { id: 'all', name: 'Tous', icon: '🌐', color: '#475569', bg: '#f1f5f9' };
const OPS = [ALL, ...Object.values(OPERATORS)];

const css = `
.op-filter {
  display: flex; gap: 6px; padding: 10px 14px;
  background: var(--surface-0);
  border-bottom: 1px solid var(--surface-border);
  overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
}
.op-filter::-webkit-scrollbar { display: none; }
.op-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 13px; border-radius: 20px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  border: 1.5px solid transparent;
  transition: all var(--t-fast); white-space: nowrap;
  background: var(--surface-1);
  color: var(--text-secondary);
  border-color: var(--surface-border);
}
.op-pill.active {
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-brand);
}
.op-pill:hover:not(.active) {
  border-color: var(--surface-3);
  background: var(--surface-2);
}
.op-pill-icon { font-size: 14px; }
`;

export default function OperatorFilter() {
  const dispatch = useDispatch();
  const { selectedOperator } = useSelector(s => s.mobility);

  return (
    <div className="op-filter" role="toolbar" aria-label="Filtrer par opérateur">
      <style>{css}</style>
      {OPS.map(op => {
        const active = selectedOperator === op.id;
        return (
          <button
            key={op.id}
            className={`op-pill${active ? ' active' : ''}`}
            style={active ? { background: op.color } : {}}
            onClick={() => dispatch(setSelectedOperator(op.id))}
          >
            <span className="op-pill-icon">{op.icon}</span>
            <span>{op.name}</span>
          </button>
        );
      })}
    </div>
  );
}
