import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Admin.css';
import {
  FiPlus, FiEdit2, FiTrash2, FiLogOut, FiCheck, FiX,
  FiUser, FiBook, FiImage, FiGlobe, FiEye, FiEyeOff,
  FiSun, FiMoon, FiBox, FiBriefcase, FiAward, FiMessageSquare,
  FiGrid, FiMenu, FiChevronLeft, FiActivity, FiSettings,
  FiDownload, FiUpload, FiKey, FiLock, FiUsers, FiSearch,
  FiTrendingUp, FiClock, FiRefreshCw, FiDatabase, FiCopy,
  FiExternalLink
} from 'react-icons/fi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  verifyToken,
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, updateSkill, deleteSkill,
  getExperience, createExperience, updateExperience, deleteExperience,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
  getLeadership, createLeadership, updateLeadership, deleteLeadership,
  getMessages, markMessageRead, deleteMessage,
  getProfile, updateProfile,
  getAllArticles, createArticle, updateArticle, deleteArticle,
  getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  uploadFile, getImageUrl,
  getDashboardAnalytics, getActivityLog, logActivity,
  getSettings, updateSettings,
  exportBackup, importBackup,
  changePassword,
  getClients, createClient, updateClient, deleteClient, regenerateClientKey,
} from '../api';

/* ═══════════════════════════════════════
   MAIN ADMIN COMPONENT
   ═══════════════════════════════════════ */
export default function Admin() {
  const navigate = useNavigate();
  const { section } = useParams();
  const tab = section || 'dashboard';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    projects: [], skills: [], experience: [], achievements: [],
    leadership: [], messages: [], profile: null, articles: [], gallery: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') || 'dark';
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const showNotif = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    verifyToken()
      .then(() => loadAll())
      .catch(() => navigate('/login'));
  }, []);

  const loadAll = async () => {
    const safeGet = async (fn, fallback) => {
      try { const res = await fn(); return res.data; } catch { return fallback; }
    };
    const [p, s, e, a, l, m, pr, ar, g] = await Promise.all([
      safeGet(getProjects, []),
      safeGet(getSkills, []),
      safeGet(getExperience, []),
      safeGet(getAchievements, []),
      safeGet(getLeadership, []),
      safeGet(getMessages, []),
      safeGet(getProfile, null),
      safeGet(getAllArticles, []),
      safeGet(getGalleryItems, []),
    ]);
    setData({ projects: p, skills: s, experience: e, achievements: a, leadership: l, messages: m, profile: pr, articles: ar, gallery: g });
    setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const handleDelete = (type, id) => {
    setDeleteConfirm({ type, id });
  };

  const executeDelete = async (type, id) => {
    try {
      if (type === 'projects') await deleteProject(id);
      else if (type === 'skills') await deleteSkill(id);
      else if (type === 'experience') await deleteExperience(id);
      else if (type === 'achievements') await deleteAchievement(id);
      else if (type === 'leadership') await deleteLeadership(id);
      else if (type === 'messages') await deleteMessage(id);
      else if (type === 'articles') await deleteArticle(id);
      else if (type === 'gallery') await deleteGalleryItem(id);
      else if (type === 'clients') await deleteClient(id);
      
      setDeleteConfirm(null);
      showNotif('Item deleted successfully');
      loadAll();
    } catch (err) {
      showNotif('Failed to delete: ' + (err.response?.data?.message || err.message), 'error');
      setDeleteConfirm(null);
    }
  };

  const openCreate = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };
  const afterSave = (msg) => { closeModal(); loadAll(); showNotif(msg || 'Saved successfully'); };

  if (loading) return (
    <div className="ta-loading">
      <div className="ta-spinner" />
      <span>Loading admin panel...</span>
    </div>
  );

  const menuGroups = [
    {
      title: 'MAIN',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { key: 'projects', label: 'Projects', icon: <FiGlobe />, count: data.projects.length },
        { key: 'skills', label: 'Skills', icon: <FiBox />, count: data.skills.length },
        { key: 'experience', label: 'Experience', icon: <FiBriefcase />, count: data.experience.length },
        { key: 'achievements', label: 'Achievements', icon: <FiAward />, count: data.achievements.length },
        { key: 'leadership', label: 'Leadership', icon: <FiActivity />, count: data.leadership.length },
        { key: 'articles', label: 'Articles', icon: <FiBook />, count: data.articles.length },
        { key: 'gallery', label: 'Gallery', icon: <FiImage />, count: data.gallery.length },
        { key: 'messages', label: 'Messages', icon: <FiMessageSquare />, count: data.messages.filter(m => !m.read).length },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { key: 'clients', label: 'Clients (B2B)', icon: <FiUsers /> },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { key: 'profile', label: 'Profile', icon: <FiUser /> },
        { key: 'settings', label: 'Site Settings', icon: <FiSettings /> },
        { key: 'security', label: 'Security', icon: <FiLock /> },
        { key: 'backup', label: 'Backup', icon: <FiDatabase /> },
      ],
    },
  ];

  const currentLabel = menuGroups.flatMap(g => g.items).find(i => i.key === tab)?.label || 'Dashboard';
  const unreadCount = data.messages.filter(m => !m.read).length;

  // Filter helper for searchable tabs
  const filterItems = (items, fields) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item =>
      fields.some(field => {
        const val = item[field];
        if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(q));
        return String(val || '').toLowerCase().includes(q);
      })
    );
  };

  return (
    <div className="ta-admin">
      {/* Notification Toast */}
      {notification && (
        <div className={`ta-toast ta-toast--${notification.type}`}>
          {notification.type === 'success' ? <FiCheck /> : <FiX />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Sidebar Overlay for mobile */}
      <div className={`ta-sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* ── SIDEBAR ── */}
      <aside className={`ta-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <a href="/" className="ta-sidebar__logo">
          <div className="ta-sidebar__logo-icon">A</div>
          <div className="ta-sidebar__logo-text">
            <span>Admin Panel</span>
            <span>Portfolio CMS</span>
          </div>
        </a>

        <nav className="ta-sidebar__nav">
          {menuGroups.map(group => (
            <div className="ta-sidebar__group" key={group.title}>
              <div className="ta-sidebar__group-title">{group.title}</div>
              {group.items.map(item => (
                <button
                  key={item.key}
                  className={`ta-sidebar__item ${tab === item.key ? 'active' : ''}`}
                  onClick={() => { setShowModal(false); setEditItem(null); setMobileOpen(false); setSearchQuery(''); navigate(`/admin/${item.key}`); }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="ta-sidebar__item-icon">{item.icon}</span>
                  <span className="ta-sidebar__item-label">{item.label}</span>
                  {item.count > 0 && <span className="ta-sidebar__item-badge">{item.count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="ta-sidebar__footer">
          <button className="ta-sidebar__logout" onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="ta-main">
        {/* Header */}
        <header className="ta-header">
          <div className="ta-header__left">
            <button className="ta-header__toggle" onClick={() => {
              if (window.innerWidth <= 1024) setMobileOpen(!mobileOpen);
              else setSidebarCollapsed(!sidebarCollapsed);
            }}>
              {sidebarCollapsed || mobileOpen ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
            </button>
            <div className="ta-breadcrumb">
              <span className="ta-breadcrumb__item">Admin</span>
              <span className="ta-breadcrumb__sep">/</span>
              <span className="ta-breadcrumb__current">{currentLabel}</span>
            </div>
          </div>
          <div className="ta-header__right">
            {/* Global Search */}
            {['projects', 'skills', 'experience', 'achievements', 'leadership', 'articles', 'gallery', 'messages', 'clients'].includes(tab) && (
              <div className="ta-header__search">
                <FiSearch size={14} />
                <input
                  type="text"
                  placeholder={`Search ${currentLabel}...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="ta-header__search-clear"><FiX size={12}/></button>}
              </div>
            )}
            <button className="ta-header__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <div className="ta-header__user">
              <div className="ta-header__avatar">A</div>
              <div className="ta-header__user-info">
                <span>Admin</span>
                <span>Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="ta-content">
          <h2 className="ta-page-title">{currentLabel}</h2>

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <DashboardTab data={data} navigate={navigate} unreadCount={unreadCount} />
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <ProfileTab profile={data.profile} onSave={loadAll} showNotif={showNotif} />
          )}

          {/* ── SITE SETTINGS ── */}
          {tab === 'settings' && (
            <SettingsTab showNotif={showNotif} />
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <SecurityTab showNotif={showNotif} />
          )}

          {/* ── BACKUP ── */}
          {tab === 'backup' && (
            <BackupTab showNotif={showNotif} />
          )}

          {/* ── CLIENTS (B2B) ── */}
          {tab === 'clients' && (
            <ClientsTab
              searchQuery={searchQuery}
              openCreate={openCreate}
              openEdit={openEdit}
              handleDelete={handleDelete}
              showNotif={showNotif}
            />
          )}

          {/* ── PROJECTS ── */}
          {tab === 'projects' && (
            <DataTableSection
              title="All Projects"
              onAdd={openCreate}
              headers={['Title', 'Tech Stack', 'Order', 'Actions']}
              emptyMsg="No projects yet"
              rows={filterItems(data.projects, ['title', 'description', 'techStack']).map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="ta-table__title">{item.title}</div>
                    <div className="ta-table__subtitle">{item.description?.substring(0, 60)}...</div>
                  </td>
                  <td>
                    <div className="ta-tags">
                      {item.techStack?.slice(0, 4).map(t => <span key={t} className="ta-tag">{t}</span>)}
                      {item.techStack?.length > 4 && <span className="ta-tag">+{item.techStack.length - 4}</span>}
                    </div>
                  </td>
                  <td>{item.order}</td>
                  <td>
                    <div className="ta-actions">
                      <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('projects', item._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            />
          )}

          {/* ── SKILLS ── */}
          {tab === 'skills' && (() => {
            const filtered = filterItems(data.skills, ['name', 'category']);
            const groupedSkills = ['frontend', 'backend', 'language', 'database', 'tool'].map(cat => ({
              category: cat,
              items: filtered.filter(s => s.category === cat).sort((a,b) => a.order - b.order)
            }));
            return (
              <div className="ta-skills-admin">
                <div className="ta-table-header" style={{ marginBottom: 20 }}>
                  <h3>All Skills {searchQuery && <span style={{fontSize:'0.8rem',color:'var(--ta-text-secondary)'}}>({filtered.length} results)</span>}</h3>
                  <button className="ta-btn ta-btn--primary ta-btn--sm" onClick={openCreate}><FiPlus size={14} /> Add Skill</button>
                </div>
                {filtered.length === 0 ? (
                  <div className="ta-empty">
                    <div className="ta-empty__icon">📋</div>
                    <h4>{searchQuery ? 'No matching skills' : 'No skills yet'}</h4>
                    <p>{searchQuery ? 'Try a different search term.' : 'Click "Add Skill" to create your first item.'}</p>
                  </div>
                ) : (
                  <div className="ta-skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {groupedSkills.map(group => group.items.length > 0 && (
                      <div key={group.category} className="ta-stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--ta-text-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--ta-border)', paddingBottom: '8px', width: '100%' }}>
                          {group.category}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {group.items.map(item => (
                            <div key={item._id} className="ta-skill-pill" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'var(--ta-bg-primary)', padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--ta-border)', fontSize: '0.9rem', gap: '8px' }}>
                              <span>{item.name}</span>
                              <div style={{ display: 'flex', gap: '4px', opacity: 0.7 }}>
                                <button type="button" className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)} style={{ padding: 2, background: 'transparent' }}><FiEdit2 size={12} /></button>
                                <button type="button" className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('skills', item._id)} style={{ padding: 2, background: 'transparent' }}><FiTrash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── EXPERIENCE ── */}
          {tab === 'experience' && (
            <DataTableSection
              title="All Experience"
              onAdd={openCreate}
              headers={['Role', 'Company', 'Duration', 'Type', 'Actions']}
              emptyMsg="No experience entries yet"
              rows={filterItems(data.experience, ['role', 'company', 'duration']).map(item => (
                <tr key={item._id}>
                  <td><span className="ta-table__title">{item.role}</span></td>
                  <td>{item.company}</td>
                  <td>{item.duration}</td>
                  <td><span className={`ta-badge ${item.type === 'work' ? 'ta-badge--info' : 'ta-badge--success'}`}>{item.type}</span></td>
                  <td>
                    <div className="ta-actions">
                      <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('experience', item._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            />
          )}

          {/* ── ACHIEVEMENTS ── */}
          {tab === 'achievements' && (
            <DataTableSection
              title="All Achievements"
              onAdd={openCreate}
              headers={['Title', 'Category', 'Date', 'Actions']}
              emptyMsg="No achievements yet"
              rows={filterItems(data.achievements, ['title', 'description', 'category']).map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="ta-table__title">{item.title}</div>
                    <div className="ta-table__subtitle">{item.description?.substring(0, 60)}</div>
                  </td>
                  <td><span className="ta-badge ta-badge--warning">{item.category}</span></td>
                  <td>{item.date}</td>
                  <td>
                    <div className="ta-actions">
                      <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('achievements', item._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            />
          )}

          {/* ── LEADERSHIP ── */}
          {tab === 'leadership' && (
            <DataTableSection
              title="Leadership & Activities"
              onAdd={openCreate}
              headers={['Title / Role', 'Organization', 'Date', 'Actions']}
              emptyMsg="No leadership items yet"
              rows={filterItems(data.leadership, ['title', 'role', 'organization']).map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="ta-table__title">{item.title}</div>
                    {item.role && <div className="ta-table__subtitle">{item.role}</div>}
                  </td>
                  <td>
                    {item.organization
                      ? <span className="ta-badge ta-badge--info">{item.organization}</span>
                      : <span style={{ color: 'var(--ta-text-secondary)', fontSize: '0.82rem' }}>—</span>
                    }
                  </td>
                  <td style={{ color: 'var(--ta-text-secondary)', fontSize: '0.85rem' }}>{item.date || '—'}</td>
                  <td>
                    <div className="ta-actions">
                      <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('leadership', item._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            />
          )}

          {/* ── ARTICLES ── */}
          {tab === 'articles' && (
            <DataTableSection
              title="All Articles"
              onAdd={openCreate}
              headers={['Title', 'Category', 'Status', 'Read Time', 'Actions']}
              emptyMsg="No articles yet"
              rows={filterItems(data.articles, ['title', 'excerpt', 'category']).map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="ta-table__title">{item.title}</div>
                    <div className="ta-table__subtitle">{item.excerpt?.substring(0, 50)}...</div>
                  </td>
                  <td><span className="ta-badge ta-badge--primary">{item.category}</span></td>
                  <td>
                    {item.published
                      ? <span className="ta-badge ta-badge--success"><FiEye size={10} /> Published</span>
                      : <span className="ta-badge ta-badge--muted"><FiEyeOff size={10} /> Draft</span>
                    }
                  </td>
                  <td>{item.readTime}</td>
                  <td>
                    <div className="ta-actions">
                      <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('articles', item._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            />
          )}

          {/* ── GALLERY ── */}
          {tab === 'gallery' && (
            <>
              <div className="ta-table-header" style={{ background: 'var(--ta-surface)', border: '1px solid var(--ta-border)', borderRadius: '10px 10px 0 0', marginBottom: 0 }}>
                <h3>All Gallery Items</h3>
                <button className="ta-btn ta-btn--primary ta-btn--sm" onClick={openCreate}><FiPlus size={14} /> Add New</button>
              </div>
              {data.gallery.length === 0 ? (
                <div className="ta-empty" style={{ background: 'var(--ta-surface)', border: '1px solid var(--ta-border)', borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
                  <div className="ta-empty__icon">🖼️</div>
                  <h4>No gallery items yet</h4>
                  <p>Click &quot;Add New&quot; to create your first gallery item.</p>
                </div>
              ) : (
                <div className="ta-gallery-grid" style={{ marginTop: 20 }}>
                  {filterItems(data.gallery, ['title', 'category', 'description']).map(item => (
                    <div className="ta-gallery-card" key={item._id}>
                      {item.imageUrl && <img src={getImageUrl(item.imageUrl)} alt={item.title} className="ta-gallery-card__img" />}
                      <div className="ta-gallery-card__body">
                        <h4>{item.title}</h4>
                        <span className="ta-badge ta-badge--primary">{item.category}</span>
                        {item.description && <p>{item.description}</p>}
                      </div>
                      <div className="ta-gallery-card__footer">
                        <span style={{ fontSize: '0.78rem', color: 'var(--ta-text-secondary)' }}>Order: {item.order}</span>
                        <div className="ta-actions">
                          <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                          <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('gallery', item._id)}><FiTrash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <div className="ta-table-wrapper">
              <div className="ta-table-header">
                <h3>All Messages {unreadCount > 0 && <span className="ta-badge ta-badge--danger" style={{ marginLeft: 8 }}>{unreadCount} unread</span>}</h3>
              </div>
              {data.messages.length === 0 ? (
                <div className="ta-empty">
                  <div className="ta-empty__icon">📬</div>
                  <h4>No messages yet</h4>
                  <p>Messages from your contact form will appear here.</p>
                </div>
              ) : (
                <table className="ta-table">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(data.messages, ['name', 'email', 'message']).map(item => (
                      <tr key={item._id} className={!item.read ? 'unread' : ''}>
                        <td>
                          <div className="ta-table__title">{item.name}</div>
                          <div className="ta-table__subtitle">{item.email}</div>
                        </td>
                        <td style={{ maxWidth: 300 }}>{item.message?.substring(0, 80)}...</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>
                          {item.read
                            ? <span className="ta-badge ta-badge--success">Read</span>
                            : <span className="ta-badge ta-badge--warning">Unread</span>
                          }
                        </td>
                        <td>
                          <div className="ta-actions">
                            {!item.read && (
                              <button className="ta-action-btn ta-action-btn--success" onClick={async () => { await markMessageRead(item._id); loadAll(); }} title="Mark as read"><FiCheck size={14} /></button>
                            )}
                            <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('messages', item._id)}><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && !['profile', 'dashboard', 'settings', 'security', 'backup'].includes(tab) && (
        <div className="ta-modal-overlay" onClick={closeModal}>
          <div className="ta-modal" onClick={e => e.stopPropagation()}>
            <div className="ta-modal__header">
              <h3>{editItem ? 'Edit' : 'Create'} {currentLabel.replace(/s$/, '').replace(' (B2B)', '')}</h3>
              <button className="ta-modal__close" onClick={closeModal}><FiX size={18} /></button>
            </div>
            <div className="ta-modal__body">
              {tab === 'projects' && <ProjectForm item={editItem} onSave={afterSave} />}
              {tab === 'skills' && <SkillForm item={editItem} onSave={afterSave} />}
              {tab === 'experience' && <ExperienceForm item={editItem} onSave={afterSave} />}
              {tab === 'achievements' && <AchievementForm item={editItem} onSave={afterSave} />}
              {tab === 'leadership' && <LeadershipForm item={editItem} onSave={afterSave} />}
              {tab === 'articles' && <ArticleForm item={editItem} onSave={afterSave} />}
              {tab === 'gallery' && <GalleryForm item={editItem} onSave={afterSave} />}
              {tab === 'clients' && <ClientForm item={editItem} onSave={afterSave} />}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="ta-modal-overlay">
          <div className="ta-modal" style={{ maxWidth: '400px' }}>
            <div className="ta-modal__header">
              <h3>Confirm Deletion</h3>
              <button className="ta-modal__close" onClick={() => setDeleteConfirm(null)}><FiX size={20} /></button>
            </div>
            <div className="ta-modal__body" style={{ padding: '20px' }}>
              <p style={{ margin: 0, color: 'var(--ta-text-secondary)' }}>Are you sure you want to delete this item? This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button className="ta-btn" onClick={() => setDeleteConfirm(null)} style={{ background: 'transparent', border: '1px solid var(--ta-border)' }}>Cancel</button>
                <button className="ta-btn ta-btn--primary" style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }} onClick={() => executeDelete(deleteConfirm.type, deleteConfirm.id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════
   DASHBOARD TAB (Enhanced with Analytics)
   ═══════════════════════════════════════ */
function DashboardTab({ data, navigate, unreadCount }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getDashboardAnalytics()
      .then(res => setAnalytics(res.data))
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Total Projects', value: data.projects.length, icon: <FiGlobe />, color: 'primary', tab: 'projects' },
    { label: 'Total Skills', value: data.skills.length, icon: <FiBox />, color: 'success', tab: 'skills' },
    { label: 'Articles', value: data.articles.length, icon: <FiBook />, color: 'info', tab: 'articles' },
    { label: 'Gallery Items', value: data.gallery.length, icon: <FiImage />, color: 'warning', tab: 'gallery' },
    { label: 'Unread Messages', value: unreadCount, icon: <FiMessageSquare />, color: 'danger', tab: 'messages' },
    { label: 'Experience', value: data.experience.length, icon: <FiBriefcase />, color: 'primary', tab: 'experience' },
    { label: 'Achievements', value: data.achievements.length, icon: <FiAward />, color: 'success', tab: 'achievements' },
    { label: 'Leadership', value: data.leadership.length, icon: <FiActivity />, color: 'info', tab: 'leadership' },
  ];

  const actionIcons = {
    create: '✨', update: '✏️', delete: '🗑️', login: '🔐',
    logout: '🚪', password_change: '🔒', settings_update: '⚙️',
    backup: '💾', restore: '📥',
  };

  return (
    <>
      {/* Stats Grid */}
      <div className="ta-stats">
        {stats.map(s => (
          <div className="ta-stat-card" key={s.label} onClick={() => navigate(`/admin/${s.tab}`)} style={{ cursor: 'pointer' }}>
            <div className={`ta-stat-card__icon ta-stat-card__icon--${s.color}`}>{s.icon}</div>
            <div className="ta-stat-card__info">
              <h4>{s.value}</h4>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="ta-table-wrapper" style={{ marginTop: 8 }}>
        <div className="ta-table-header">
          <h3>⚡ Quick Actions</h3>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Add Project', icon: <FiGlobe />, tab: 'projects' },
            { label: 'Write Article', icon: <FiBook />, tab: 'articles' },
            { label: 'Upload Gallery', icon: <FiImage />, tab: 'gallery' },
            { label: 'View Messages', icon: <FiMessageSquare />, tab: 'messages' },
            { label: 'Site Settings', icon: <FiSettings />, tab: 'settings' },
            { label: 'Export Backup', icon: <FiDownload />, tab: 'backup' },
          ].map(action => (
            <button key={action.label} className="ta-btn ta-btn--ghost" onClick={() => navigate(`/admin/${action.tab}`)} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start', padding: '12px 16px' }}>
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {analytics?.recentActivities?.length > 0 && (
        <div className="ta-table-wrapper" style={{ marginTop: 8 }}>
          <div className="ta-table-header">
            <h3><FiClock size={16} style={{ marginRight: 6 }} /> Recent Activity</h3>
          </div>
          <div style={{ padding: '12px 16px' }}>
            {analytics.recentActivities.slice(0, 8).map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--ta-border)' }}>
                <span style={{ fontSize: '1.2rem' }}>{actionIcons[act.action] || '📋'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--ta-text-primary)' }}>
                    {act.action.charAt(0).toUpperCase() + act.action.slice(1)} — {act.resourceType}
                  </div>
                  {act.resourceTitle && <div style={{ fontSize: '0.78rem', color: 'var(--ta-text-secondary)' }}>{act.resourceTitle}</div>}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--ta-text-secondary)', whiteSpace: 'nowrap' }}>
                  {new Date(act.createdAt).toLocaleDateString()} {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Messages Table */}
      {data.messages.length > 0 && (
        <div className="ta-table-wrapper" style={{ marginTop: 8 }}>
          <div className="ta-table-header">
            <h3>Recent Messages</h3>
            <button className="ta-btn ta-btn--ghost ta-btn--sm" onClick={() => navigate('/admin/messages')}>View All →</button>
          </div>
          <table className="ta-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.messages.slice(0, 5).map(m => (
                <tr key={m._id} className={!m.read ? 'unread' : ''}>
                  <td>
                    <div className="ta-table__title">{m.name}</div>
                    <div className="ta-table__subtitle">{m.email}</div>
                  </td>
                  <td>{m.message?.substring(0, 60)}...</td>
                  <td>
                    {m.read
                      ? <span className="ta-badge ta-badge--success">Read</span>
                      : <span className="ta-badge ta-badge--warning">Unread</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}


/* ═══════════════════════════════════════
   DATA TABLE SECTION (Reusable)
   ═══════════════════════════════════════ */
function DataTableSection({ title, onAdd, headers, rows, emptyMsg }) {
  return (
    <div className="ta-table-wrapper">
      <div className="ta-table-header">
        <h3>{title} <span style={{ fontSize: '0.8rem', color: 'var(--ta-text-secondary)', fontWeight: 400 }}>({rows.length})</span></h3>
        <button className="ta-btn ta-btn--primary ta-btn--sm" onClick={onAdd}><FiPlus size={14} /> Add New</button>
      </div>
      {rows.length === 0 ? (
        <div className="ta-empty">
          <div className="ta-empty__icon">📋</div>
          <h4>{emptyMsg}</h4>
          <p>Click &quot;Add New&quot; to create your first item.</p>
        </div>
      ) : (
        <table className="ta-table">
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════
   SETTINGS TAB
   ═══════════════════════════════════════ */
function SettingsTab({ showNotif }) {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(res => setSettings(res.data)).catch(() => setSettings({}));
  }, []);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  const setNested = (parent, k, v) => setSettings(s => ({ ...s, [parent]: { ...s[parent], [k]: v } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      showNotif('Settings saved successfully');
    } catch (err) {
      showNotif('Failed to save settings: ' + (err.response?.data?.message || err.message), 'error');
    }
    setSaving(false);
  };

  if (!settings) return <div className="ta-loading"><div className="ta-spinner" />Loading settings...</div>;

  return (
    <form onSubmit={handleSave}>
      {/* SEO */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>🔍 SEO Settings</h3>
          <button type="submit" className="ta-btn ta-btn--primary" disabled={saving} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        <div className="ta-profile-section__body">
          <div className="ta-form-group">
            <label className="ta-form-label">Site Title</label>
            <input className="ta-form-input" value={settings.siteTitle || ''} onChange={e => set('siteTitle', e.target.value)} placeholder="Portfolio CMS" />
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Meta Description</label>
            <textarea className="ta-form-textarea" rows={3} value={settings.siteDescription || ''} onChange={e => set('siteDescription', e.target.value)} placeholder="A short description for search engines..." />
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Keywords (comma separated)</label>
            <input className="ta-form-input" value={settings.siteKeywords || ''} onChange={e => set('siteKeywords', e.target.value)} placeholder="portfolio, developer, react" />
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Google Analytics ID</label>
            <input className="ta-form-input" value={settings.googleAnalyticsId || ''} onChange={e => set('googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>🎨 Branding</h3></div>
        <div className="ta-profile-section__body">
          <div className="ta-form-row">
            <div className="ta-form-group">
              <label className="ta-form-label">Brand Name</label>
              <input className="ta-form-input" value={settings.brandName || ''} onChange={e => set('brandName', e.target.value)} />
            </div>
            <div className="ta-form-group">
              <label className="ta-form-label">Accent Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={settings.accentColor || '#2dd4bf'} onChange={e => set('accentColor', e.target.value)} style={{ width: 40, height: 35, border: 'none', cursor: 'pointer' }} />
                <input className="ta-form-input" value={settings.accentColor || ''} onChange={e => set('accentColor', e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>🌐 Social Links</h3></div>
        <div className="ta-profile-section__body">
          {['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'youtube'].map(platform => (
            <div className="ta-form-group" key={platform}>
              <label className="ta-form-label" style={{ textTransform: 'capitalize' }}>{platform}</label>
              <input className="ta-form-input" value={settings.socialLinks?.[platform] || ''} onChange={e => setNested('socialLinks', platform, e.target.value)} placeholder={`https://${platform}.com/...`} />
            </div>
          ))}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>🔧 Feature Toggles</h3></div>
        <div className="ta-profile-section__body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { key: 'showArticles', label: 'Show Articles Section' },
              { key: 'showGallery', label: 'Show Gallery Section' },
              { key: 'showContact', label: 'Show Contact Form' },
              { key: 'showNewsletter', label: 'Show Newsletter' },
              { key: 'maintenanceMode', label: '⚠️ Maintenance Mode' },
            ].map(toggle => (
              <label key={toggle.key} className="ta-form-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.features?.[toggle.key] || false} onChange={e => setNested('features', toggle.key, e.target.checked)} />
                <span>{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>📎 Footer</h3>
          <button type="submit" className="ta-btn ta-btn--primary" disabled={saving} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
        <div className="ta-profile-section__body">
          <div className="ta-form-group">
            <label className="ta-form-label">Footer Text</label>
            <input className="ta-form-input" value={settings.footerText || ''} onChange={e => set('footerText', e.target.value)} />
          </div>
        </div>
      </div>
    </form>
  );
}


/* ═══════════════════════════════════════
   SECURITY TAB
   ═══════════════════════════════════════ */
function SecurityTab({ showNotif }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return showNotif('New password and confirmation do not match', 'error');
    }
    if (form.newPassword.length < 8) {
      return showNotif('Password must be at least 8 characters', 'error');
    }
    setSaving(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      showNotif('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showNotif(err.response?.data?.message || 'Failed to change password', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="ta-profile-section">
      <div className="ta-profile-section__header"><h3>🔒 Change Password</h3></div>
      <div className="ta-profile-section__body">
        <form onSubmit={handleChangePassword} style={{ maxWidth: 400 }}>
          <div className="ta-form-group">
            <label className="ta-form-label">Current Password</label>
            <input className="ta-form-input" type="password" value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} required />
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">New Password</label>
            <input className="ta-form-input" type="password" value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} required minLength={8} />
            <span className="ta-form-hint">Minimum 8 characters</span>
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Confirm New Password</label>
            <input className="ta-form-input" type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required />
          </div>
          <button type="submit" className="ta-btn ta-btn--primary" disabled={saving} style={{ marginTop: 8 }}>
            <FiLock size={14} /> {saving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   BACKUP TAB
   ═══════════════════════════════════════ */
function BackupTab({ showNotif }) {
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      const res = await exportBackup();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotif('Backup exported successfully');
    } catch (err) {
      showNotif('Export failed: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importBackup(data);
      showNotif('Backup imported successfully! Refreshing data...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      showNotif('Import failed: ' + (err.response?.data?.message || err.message), 'error');
    }
    setImporting(false);
  };

  return (
    <div style={{ display: 'grid', gap: '24px', maxWidth: 600 }}>
      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>💾 Export Backup</h3></div>
        <div className="ta-profile-section__body">
          <p style={{ color: 'var(--ta-text-secondary)', marginBottom: '16px' }}>
            Download a complete JSON backup of all your portfolio data (projects, skills, experience, articles, gallery, etc.)
          </p>
          <button className="ta-btn ta-btn--primary" onClick={handleExport}>
            <FiDownload size={14} /> Export Full Backup
          </button>
        </div>
      </div>

      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>📥 Import Backup</h3></div>
        <div className="ta-profile-section__body">
          <p style={{ color: 'var(--ta-text-secondary)', marginBottom: '8px' }}>
            Restore from a previously exported JSON backup file. <strong style={{ color: '#ef4444' }}>Warning: This will replace all existing data.</strong>
          </p>
          <div className="ta-file-upload" style={{ marginTop: '12px' }}>
            <input type="file" accept=".json" onChange={handleImport} disabled={importing} />
            {importing && <span style={{ fontSize: '0.82rem' }}>Importing...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   CLIENTS TAB (B2B)
   ═══════════════════════════════════════ */
function ClientsTab({ searchQuery, openCreate, openEdit, handleDelete, showNotif }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, [searchQuery]);

  const loadClients = async () => {
    try {
      const res = await getClients({ search: searchQuery || undefined });
      setClients(res.data.clients || []);
    } catch { setClients([]); }
    setLoading(false);
  };

  const handleRegenKey = async (id) => {
    if (!window.confirm('Regenerate API key? The old key will stop working immediately.')) return;
    try {
      const res = await regenerateClientKey(id);
      showNotif('New API key generated');
      loadClients();
    } catch (err) {
      showNotif('Failed to regenerate key', 'error');
    }
  };

  const statusColors = { active: 'success', inactive: 'muted', suspended: 'danger', trial: 'warning' };
  const planColors = { starter: 'info', professional: 'primary', enterprise: 'success' };

  if (loading) return <div className="ta-loading"><div className="ta-spinner" />Loading clients...</div>;

  return (
    <DataTableSection
      title="B2B Clients"
      onAdd={openCreate}
      headers={['Company', 'Contact', 'Plan', 'Status', 'Actions']}
      emptyMsg="No clients yet — Add your first B2B client"
      rows={clients.map(client => (
        <tr key={client._id}>
          <td>
            <div className="ta-table__title">{client.companyName}</div>
            <div className="ta-table__subtitle">{client.industry || 'No industry'}</div>
          </td>
          <td>
            <div className="ta-table__title">{client.contactName || '—'}</div>
            <div className="ta-table__subtitle">{client.contactEmail}</div>
          </td>
          <td><span className={`ta-badge ta-badge--${planColors[client.plan] || 'info'}`}>{client.plan}</span></td>
          <td><span className={`ta-badge ta-badge--${statusColors[client.status] || 'info'}`}>{client.status}</span></td>
          <td>
            <div className="ta-actions">
              <button className="ta-action-btn ta-action-btn--edit" onClick={() => openEdit(client)} title="Edit"><FiEdit2 size={14} /></button>
              <button className="ta-action-btn" onClick={() => handleRegenKey(client._id)} title="Regenerate API Key" style={{ color: 'var(--ta-warning)' }}><FiKey size={14} /></button>
              <button className="ta-action-btn ta-action-btn--delete" onClick={() => handleDelete('clients', client._id)} title="Delete"><FiTrash2 size={14} /></button>
            </div>
          </td>
        </tr>
      ))}
    />
  );
}


/* ═══════════════════════════════════════
   PROFILE TAB
   ═══════════════════════════════════════ */
function ProfileTab({ profile, onSave, showNotif }) {
  const empty = {
    name: '', title: '', tagline: '', quote: '',
    email: '', phone: '', location: '',
    photoUrl: '', resumeUrl: '', githubUrl: '', linkedinUrl: '',
    bio: '', floatingTags: '', stats: '',
  };
  const toForm = (p) => p ? {
    ...p,
    bio: Array.isArray(p.bio) ? p.bio.join('\n') : p.bio || '',
    floatingTags: Array.isArray(p.floatingTags) ? p.floatingTags.join(', ') : p.floatingTags || '',
    stats: Array.isArray(p.stats) ? p.stats.map(s => `${s.icon}|${s.value}|${s.label}`).join('\n') : '',
  } : empty;

  const [form, setForm] = useState(toForm(profile));
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(toForm(profile)); }, [profile]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const parseStats = (raw) => {
    return raw.split('\n').filter(Boolean).map(line => {
      const [icon = '', value = '', label = ''] = line.split('|');
      return { icon: icon.trim(), value: value.trim(), label: label.trim() };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        bio: form.bio.split('\n').filter(Boolean),
        floatingTags: form.floatingTags.split(',').map(s => s.trim()).filter(Boolean),
        stats: parseStats(form.stats),
      };
      await updateProfile(payload);
      showNotif('Profile saved successfully');
      onSave();
    } catch (err) {
      showNotif('Failed to save profile: ' + (err.response?.data?.message || err.message), 'error');
    }
    setSaving(false);
  };

  return (
    <form className="ta-profile-form" onSubmit={handleSubmit}>
      {/* Personal Info */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Personal Information</h3>
          <button type="submit" className="ta-btn ta-btn--primary" disabled={saving} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            {saving ? 'Saving...' : '💾 Save Profile'}
          </button>
        </div>
        <div className="ta-profile-section__body">
          <div className="ta-form-row">
            <div className="ta-form-group">
              <label className="ta-form-label">Full Name</label>
              <input className="ta-form-input" placeholder="Tabassum Authoy" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="ta-form-group">
              <label className="ta-form-label">Title / Role</label>
              <input className="ta-form-input" placeholder="Full Stack Developer" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Tagline (Hero description)</label>
            <input className="ta-form-input" placeholder="Software Engineer 🚀 | Building the future..." value={form.tagline} onChange={e => set('tagline', e.target.value)} />
          </div>
          <div className="ta-form-row">
            <div className="ta-form-group">
              <label className="ta-form-label">Email Address</label>
              <input className="ta-form-input" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="ta-form-group">
              <label className="ta-form-label">Phone Number</label>
              <input className="ta-form-input" placeholder="+880 1..." value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Location</label>
            <input className="ta-form-input" placeholder="Dhaka, Bangladesh" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Links & Media */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>Links & Media</h3></div>
        <div className="ta-profile-section__body">
          <div className="ta-form-group">
            <label className="ta-form-label">Photo</label>
            <div className="ta-file-upload">
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const fd = new FormData(); fd.append('image', file);
                try { const res = await uploadFile(fd); set('photoUrl', res.data.url); } catch (err) { alert('Upload failed: ' + (err.response?.data?.message || err.message)); }
              }} />
              {form.photoUrl && <span className="ta-file-status">✓ Image Ready</span>}
            </div>
            <input className="ta-form-input" placeholder="Or enter Photo URL" value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)} />
            {form.photoUrl && <img src={getImageUrl(form.photoUrl)} alt="Profile Preview" className="ta-img-preview" />}
          </div>
          <div className="ta-form-row">
            <div className="ta-form-group">
              <label className="ta-form-label">Resume CV File</label>
              <div className="ta-file-upload">
                <input type="file" accept="application/pdf" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const fd = new FormData(); fd.append('image', file);
                  try { const res = await uploadFile(fd); set('resumeUrl', res.data.url); } catch (err) { alert('Upload failed: ' + (err.response?.data?.message || err.message)); }
                }} />
                {form.resumeUrl && <span className="ta-file-status">✓ File Ready</span>}
              </div>
              <input className="ta-form-input" placeholder="Or enter Resume URL" value={form.resumeUrl} onChange={e => set('resumeUrl', e.target.value)} />
            </div>
            <div className="ta-form-group">
              <label className="ta-form-label">GitHub URL</label>
              <input className="ta-form-input" placeholder="https://github.com/..." value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} />
            </div>
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">LinkedIn URL</label>
            <input className="ta-form-input" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header"><h3>About Section</h3></div>
        <div className="ta-profile-section__body">
          <div className="ta-form-group">
            <label className="ta-form-label">Quote</label>
            <input className="ta-form-input" placeholder="The best code..." value={form.quote} onChange={e => set('quote', e.target.value)} />
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">Bio Paragraphs (one per line)</label>
            <textarea className="ta-form-textarea" rows={5} placeholder="I'm a 3rd-year CSE student..." value={form.bio} onChange={e => set('bio', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Hero & Stats */}
      <div className="ta-profile-section">
        <div className="ta-profile-section__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Hero Floating Tags & Stats</h3>
          <button type="submit" className="ta-btn ta-btn--primary" disabled={saving} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            {saving ? 'Saving...' : '💾 Save All'}
          </button>
        </div>
        <div className="ta-profile-section__body">
          <div className="ta-form-group">
            <label className="ta-form-label">Floating Tags (comma separated)</label>
            <input className="ta-form-input" placeholder="UI Magic, Clean Code, Innovation" value={form.floatingTags} onChange={e => set('floatingTags', e.target.value)} />
          </div>
          <div className="ta-form-group">
            <label className="ta-form-label">About Stats (one per line: icon|value|label)</label>
            <span className="ta-form-hint">Example: 🎓|MSc / EMBA|BRAC & DU</span>
            <textarea className="ta-form-textarea" rows={5} placeholder={'💼|Manager|BD at SoftifyBD\n🎓|MSc / EMBA|BRAC & DU'} value={form.stats} onChange={e => set('stats', e.target.value)} />
          </div>
        </div>
      </div>
    </form>
  );
}


/* ═══════════════════════════════════════
   FORM COMPONENTS (for modals)
   ═══════════════════════════════════════ */
function ProjectForm({ item, onSave }) {
  const [form, setForm] = useState(item || { title: '', description: '', techStack: '', sourceUrl: '', liveUrl: '', image: '', order: 0 });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()) : form.techStack };
      if (item?._id) await updateProject(item._id, payload);
      else await createProject(payload);
      onSave(item?._id ? 'Project updated' : 'Project created');
    } catch (err) {
      alert('Failed to save project: ' + (err.response?.data?.message || err.message));
    }
  };

  const techVal = Array.isArray(form.techStack) ? form.techStack.join(', ') : form.techStack;

  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-group">
        <label className="ta-form-label">Title</label>
        <input className="ta-form-input" placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Description</label>
        <textarea className="ta-form-textarea" placeholder="Project description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Tech Stack (comma separated)</label>
        <input className="ta-form-input" placeholder="React, Node.js, MongoDB" value={techVal} onChange={e => setForm({ ...form, techStack: e.target.value })} />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Image</label>
        <div className="ta-file-upload">
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files[0]; if (!file) return;
            setUploading(true);
            const fd = new FormData(); fd.append('image', file);
            try { const res = await uploadFile(fd); setForm({ ...form, image: res.data.url }); } catch { alert('Upload failed'); }
            setUploading(false);
          }} />
          {uploading && <span style={{ fontSize: '0.82rem', color: 'var(--ta-text-secondary)' }}>Uploading...</span>}
          {form.image && <span className="ta-file-status">✓ Image Ready</span>}
        </div>
        {!form.image && !uploading && <input className="ta-form-input" placeholder="Or enter Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />}
        {form.image && <img src={getImageUrl(form.image)} alt="preview" className="ta-img-preview" />}
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Source URL</label>
          <input className="ta-form-input" placeholder="https://github.com/..." value={form.sourceUrl} onChange={e => setForm({ ...form, sourceUrl: e.target.value })} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Live URL</label>
          <input className="ta-form-input" placeholder="https://..." value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
        </div>
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Order</label>
        <input className="ta-form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} style={{ maxWidth: 120 }} />
      </div>
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update Project' : 'Create Project'}</button>
      </div>
    </form>
  );
}

function SkillForm({ item, onSave }) {
  const [form, setForm] = useState(item || { name: '', category: 'language', order: 0 });
  
  useEffect(() => {
    if (item) setForm(item);
    else setForm({ name: '', category: 'language', order: 0 });
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item?._id) await updateSkill(item._id, form);
      else await createSkill(form);
      onSave(item?._id ? 'Skill updated' : 'Skill created');
    } catch (err) {
      alert('Failed to save skill: ' + (err.response?.data?.message || err.message));
    }
  };
  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-group">
        <label className="ta-form-label">Skill Name</label>
        <input className="ta-form-input" placeholder="e.g. React" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Category</label>
          <select className="ta-form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="language">Language</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="tool">Tool</option>
          </select>
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Order</label>
          <input className="ta-form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
      </div>
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update Skill' : 'Create Skill'}</button>
      </div>
    </form>
  );
}

function ExperienceForm({ item, onSave }) {
  const [form, setForm] = useState(item || { role: '', company: '', duration: '', description: '', type: 'work', gpa: '', order: 0 });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, description: typeof form.description === 'string' ? form.description.split('\n').filter(Boolean) : form.description };
      if (item?._id) await updateExperience(item._id, payload);
      else await createExperience(payload);
      onSave(item?._id ? 'Experience updated' : 'Experience created');
    } catch (err) {
      alert('Failed to save experience: ' + (err.response?.data?.message || err.message));
    }
  };
  const descVal = Array.isArray(form.description) ? form.description.join('\n') : form.description;
  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Role / Degree</label>
          <input className="ta-form-input" placeholder="Software Engineer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Company / Institution</label>
          <input className="ta-form-input" placeholder="Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
        </div>
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Duration</label>
          <input className="ta-form-input" placeholder="2023 - Present" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Type</label>
          <select className="ta-form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="work">Work</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Description (one point per line)</label>
        <textarea className="ta-form-textarea" placeholder="Built REST APIs..." value={descVal} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">GPA (optional)</label>
          <input className="ta-form-input" placeholder="3.8" value={form.gpa} onChange={e => setForm({ ...form, gpa: e.target.value })} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Order</label>
          <input className="ta-form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
      </div>
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}

function AchievementForm({ item, onSave }) {
  const [form, setForm] = useState(item || { title: '', description: '', date: '', category: 'competition', order: 0 });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item?._id) await updateAchievement(item._id, form);
      else await createAchievement(form);
      onSave(item?._id ? 'Achievement updated' : 'Achievement created');
    } catch (err) {
      alert('Failed to save achievement: ' + (err.response?.data?.message || err.message));
    }
  };
  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-group">
        <label className="ta-form-label">Title</label>
        <input className="ta-form-input" placeholder="Achievement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Description</label>
        <textarea className="ta-form-textarea" placeholder="Describe the achievement..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Date</label>
          <input className="ta-form-input" placeholder="2024" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Category</label>
          <select className="ta-form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="competition">Competition / Award</option>
            <option value="cp">Competitive Programming</option>
            <option value="sports">Sports</option>
            <option value="publications">Publications</option>
          </select>
        </div>
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Order</label>
        <input className="ta-form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} style={{ maxWidth: 120 }} />
      </div>
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}

function LeadershipForm({ item, onSave }) {
  const [form, setForm] = useState(item || { title: '', organization: '', role: '', description: '', date: '', imageUrl: '', order: 0 });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item?._id) await updateLeadership(item._id, form);
      else await createLeadership(form);
      onSave(item?._id ? 'Leadership updated' : 'Leadership created');
    } catch (err) {
      alert('Failed to save leadership item: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-group">
        <label className="ta-form-label">Title <span style={{ color: 'var(--ta-danger)' }}>*</span></label>
        <input className="ta-form-input" placeholder="e.g. Vice President" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Organization</label>
          <input className="ta-form-input" placeholder="SEGi University Cultural Club" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Role</label>
          <input className="ta-form-input" placeholder="Club President" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
        </div>
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Description</label>
        <textarea className="ta-form-textarea" placeholder="Describe your responsibilities..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Date / Duration</label>
        <input className="ta-form-input" placeholder="Jan 2023 - Present" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Image (optional)</label>
        <div className="ta-file-upload">
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files[0]; if (!file) return;
            setUploading(true);
            const fd = new FormData(); fd.append('image', file);
            try { const res = await uploadFile(fd); setForm({ ...form, imageUrl: res.data.url }); } catch { alert('Upload failed'); }
            setUploading(false);
          }} />
          {uploading && <span style={{ fontSize: '0.82rem', color: 'var(--ta-text-secondary)' }}>Uploading...</span>}
          {form.imageUrl && <span className="ta-file-status">✓ Image Ready</span>}
        </div>
        {!form.imageUrl && !uploading && <input className="ta-form-input" placeholder="Or enter Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} style={{ marginTop: 6 }} />}
        {form.imageUrl && <img src={getImageUrl(form.imageUrl)} alt="preview" className="ta-img-preview" />}
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Order</label>
        <input className="ta-form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} style={{ maxWidth: 120 }} />
      </div>
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}

function ArticleForm({ item, onSave }) {
  const [form, setForm] = useState(item || {
    title: '', slug: '', excerpt: '', content: '',
    category: 'tech', coverImage: '', readTime: '5 min',
    published: false, order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const autoSlug = (val) => {
    set('title', val);
    if (!item?._id) {
      set('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item?._id) await updateArticle(item._id, form);
      else await createArticle(form);
      onSave(item?._id ? 'Article updated' : 'Article published');
    } catch (err) {
      alert('Failed to save article: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('image', file);
    try { 
      const res = await uploadFile(fd); 
      set('coverImage', res.data.url); 
    } catch { 
      alert('Upload failed'); 
    }
    setUploading(false);
  };

  return (
    <form className="admin-article-layout" onSubmit={handleSubmit}>
      
      {/* ── Floating Action Bar ── */}
      <div className="admin-floating-action-bar">
        <label className="ta-form-checkbox" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          {form.published ? <><FiEye size={16}/> Live</> : <><FiEyeOff size={16}/> Draft</>}
        </label>
        <button type="button" className="action-bar-btn action-bar-btn--cancel" onClick={onSave}><FiX /> Cancel</button>
        <button type="submit" className="action-bar-btn action-bar-btn--publish">
          <FiCheck /> {item?._id ? 'Update Article' : 'Publish'}
        </button>
      </div>

      <div className="admin-article-main">
        {/* Cover Image Dropzone */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ opacity: 0, position: 'absolute', inset: 0, zIndex: 10, cursor: 'pointer', width: '100%', height: '100%' }} 
          />
          {form.coverImage ? (
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={getImageUrl(form.coverImage)} alt="Cover" className="admin-dropzone-preview" />
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', pointerEvents: 'none', backdropFilter: 'blur(10px)' }}>Click to Change Cover</div>
            </div>
          ) : (
            <div className="admin-dropzone">
              <div className="admin-dropzone-icon">
                {uploading ? <div className="ta-spinner" style={{ width: 30, height: 30 }} /> : <FiImage size={40} />}
              </div>
              <div className="admin-dropzone-text">{uploading ? 'Uploading magic...' : 'Drag & Drop your Cover Image'}</div>
              <div className="admin-dropzone-sub">or click to browse from your computer (16:9 recommended)</div>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="ta-form-group" style={{ margin: 0 }}>
          <input 
            className="ta-form-input admin-article-title-input" 
            placeholder="Article title" 
            value={form.title} 
            onChange={e => autoSlug(e.target.value)} 
            required 
          />
        </div>
        
        {/* Excerpt Input */}
        <div className="ta-form-group" style={{ margin: 0 }}>
          <input 
            className="ta-form-input admin-article-excerpt-input" 
            placeholder="Write a short excerpt..." 
            value={form.excerpt} 
            onChange={e => set('excerpt', e.target.value)} 
            required 
          />
        </div>

        {/* ReactQuill Editor */}
        <div className="ta-form-group admin-article-editor" style={{ margin: 0 }}>
          <ReactQuill 
            theme="snow" 
            value={form.content} 
            onChange={(content) => set('content', content)} 
            placeholder="Tell your story..."
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link', 'image', 'clean']
                ],
                handlers: {
                  image: function() {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();
                    input.onchange = async () => {
                      const file = input.files[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('image', file);
                      const range = this.quill.getSelection(true);
                      try {
                        const res = await uploadFile(fd);
                        const url = res.data.url;
                        this.quill.insertEmbed(range.index, 'image', getImageUrl(url));
                        this.quill.setSelection(range.index + 1);
                      } catch (err) {
                        alert('Image upload failed: ' + (err.response?.data?.message || err.message));
                      }
                    };
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Post Settings Grid */}
      <div className="admin-settings-grid">
        <div className="ta-form-group">
          <label className="ta-form-label">Category</label>
          <select className="ta-form-select" value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="tech">Tech</option>
            <option value="life">Life</option>
            <option value="cp">Competitive Programming</option>
            <option value="tutorial">Tutorial</option>
            <option value="opinion">Opinion</option>
            <option value="career">Career</option>
          </select>
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">URL Slug</label>
          <input className="ta-form-input" placeholder="auto-generated-slug" value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Read Time</label>
          <input className="ta-form-input" placeholder="5 min" value={form.readTime} onChange={e => set('readTime', e.target.value)} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Display Order</label>
          <input className="ta-form-input" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
        </div>
      </div>
    </form>
  );
}

function GalleryForm({ item, onSave }) {
  const [form, setForm] = useState(item || { title: '', imageUrl: '', imageUrls: [], category: 'design', description: '', order: 0 });
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionForm = { ...form };
      if (submissionForm.imageUrls && submissionForm.imageUrls.length > 0) {
        submissionForm.imageUrl = submissionForm.imageUrls[0];
      }
      if (item?._id) await updateGalleryItem(item._id, submissionForm);
      else await createGalleryItem(submissionForm);
      onSave(item?._id ? 'Gallery item updated' : 'Gallery item created');
    } catch (err) {
      alert('Failed to save gallery item: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-group">
        <label className="ta-form-label">Title</label>
        <input className="ta-form-input" placeholder="Gallery item title" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Images</label>
        <div className="ta-file-upload">
          <input type="file" accept="image/*" multiple onChange={async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            setUploading(true);
            const uploadedUrls = [];
            for (const file of files) {
              const fd = new FormData(); fd.append('image', file);
              try { 
                const res = await uploadFile(fd); 
                uploadedUrls.push(res.data.url);
              } catch (err) { 
                alert('Upload failed for ' + file.name); 
              }
            }
            set('imageUrls', [...(form.imageUrls || []), ...uploadedUrls]);
            setUploading(false);
          }} />
          {uploading && <span style={{ fontSize: '0.82rem', color: 'var(--ta-text-secondary)' }}>Uploading...</span>}
        </div>
        
        {(form.imageUrls && form.imageUrls.length > 0) || form.imageUrl ? (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {(form.imageUrls?.length > 0 ? form.imageUrls : (form.imageUrl ? [form.imageUrl] : [])).map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={getImageUrl(url)} alt={`preview ${i}`} className="ta-img-preview" style={{ margin: 0 }} />
                <button type="button" onClick={() => {
                  if (form.imageUrls?.length > 0) {
                    set('imageUrls', form.imageUrls.filter((_, index) => index !== i));
                  } else {
                    set('imageUrl', '');
                  }
                }} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✕</button>
              </div>
            ))}
          </div>
        ) : (
          !uploading && <input className="ta-form-input" placeholder="Or enter Image URL" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} required />
        )}
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Category</label>
          <select className="ta-form-select" value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="design">Design</option>
            <option value="photo">Photography</option>
            <option value="project">Project</option>
            <option value="event">Event</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Order</label>
          <input className="ta-form-input" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
        </div>
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Description (optional)</label>
        <textarea className="ta-form-textarea" placeholder="Short description..." value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
      </div>
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}

function ClientForm({ item, onSave }) {
  const [form, setForm] = useState(item || {
    companyName: '', contactName: '', contactEmail: '', contactPhone: '',
    website: '', industry: '', plan: 'starter', status: 'trial',
    notes: '', projectsDelivered: 0, totalRevenue: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item?._id) await updateClient(item._id, form);
      else await createClient(form);
      onSave(item?._id ? 'Client updated' : 'Client created');
    } catch (err) {
      alert('Failed to save client: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form className="ta-form" onSubmit={handleSubmit}>
      <div className="ta-form-group">
        <label className="ta-form-label">Company Name <span style={{ color: '#ef4444' }}>*</span></label>
        <input className="ta-form-input" placeholder="Acme Corp" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} required />
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Contact Name</label>
          <input className="ta-form-input" placeholder="John Doe" value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Contact Email <span style={{ color: '#ef4444' }}>*</span></label>
          <input className="ta-form-input" type="email" placeholder="john@acme.com" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} required />
        </div>
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Phone</label>
          <input className="ta-form-input" placeholder="+1 234 567 8900" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Website</label>
          <input className="ta-form-input" placeholder="https://acme.com" value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
        </div>
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Industry</label>
          <input className="ta-form-input" placeholder="e.g. SaaS, E-commerce" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} />
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Plan</label>
          <select className="ta-form-select" value={form.plan} onChange={e => setForm({...form, plan: e.target.value})}>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>
      <div className="ta-form-row">
        <div className="ta-form-group">
          <label className="ta-form-label">Status</label>
          <select className="ta-form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="trial">Trial</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="ta-form-group">
          <label className="ta-form-label">Projects Delivered</label>
          <input className="ta-form-input" type="number" value={form.projectsDelivered} onChange={e => setForm({...form, projectsDelivered: Number(e.target.value)})} />
        </div>
      </div>
      <div className="ta-form-group">
        <label className="ta-form-label">Notes</label>
        <textarea className="ta-form-textarea" placeholder="Internal notes about this client..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} />
      </div>
      {item?.apiKey && (
        <div className="ta-form-group">
          <label className="ta-form-label">API Key</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input className="ta-form-input" value={item.apiKey} readOnly style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} />
            <button type="button" className="ta-btn ta-btn--ghost" onClick={() => { navigator.clipboard.writeText(item.apiKey); }} title="Copy API Key">
              <FiCopy size={14} />
            </button>
          </div>
        </div>
      )}
      <div className="ta-modal__footer" style={{ padding: 0, border: 'none' }}>
        <button type="submit" className="ta-btn ta-btn--primary">{item?._id ? 'Update Client' : 'Create Client'}</button>
      </div>
    </form>
  );
}
