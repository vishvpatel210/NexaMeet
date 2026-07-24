import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CategoryFilters = ({ activeCategory, onSelectCategory, activeDateScope, onSelectDateScope }) => {
    const categoryPills = ['All', 'Work', 'Personal', 'Important'];
    const dateTabs = ['Today', 'This Week', 'This Month'];
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
            userSelect: 'none'
        }, children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: categoryPills.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (_jsx("button", { onClick: () => onSelectCategory(cat), style: {
                            padding: '0.45rem 1.1rem',
                            borderRadius: '9999px',
                            border: isActive ? '1px solid #06B6D4' : '1px solid rgba(255, 255, 255, 0.08)',
                            backgroundColor: isActive ? '#1E293B' : '#151D2F',
                            color: isActive ? '#F8FAFC' : '#94A3B8',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isActive ? '0 0 12px rgba(6, 182, 212, 0.25)' : 'none'
                        }, children: cat === 'Important' ? '★ Important' : cat }, cat));
                }) }), _jsx("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '0.5rem'
                }, children: dateTabs.map((tab) => {
                    const isActive = activeDateScope === tab;
                    return (_jsxs("div", { onClick: () => onSelectDateScope(tab), style: {
                            fontSize: '0.9rem',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? '#F8FAFC' : '#64748B',
                            cursor: 'pointer',
                            position: 'relative',
                            paddingBottom: '0.5rem'
                        }, children: [tab, isActive && (_jsx("div", { style: {
                                    position: 'absolute',
                                    bottom: '-1px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    backgroundColor: '#06B6D4',
                                    borderRadius: '2px',
                                    boxShadow: '0 0 8px #06B6D4'
                                } }))] }, tab));
                }) })] }));
};
