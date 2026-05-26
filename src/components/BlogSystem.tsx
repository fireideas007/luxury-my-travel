import React, { useState, useEffect } from 'react';
import type { BlogPost } from '../data/blogData';
import { AUTHOR_CREDENTIALS, STAFF_CREDENTIALS, initialBlogPosts } from '../data/blogData';
import { Search, BookOpen, Clock, Tag, User, Calendar, LogIn, Plus, Trash2, Edit3, X, ArrowLeft, Send } from 'lucide-react';

interface BlogSystemProps {
  triggerApiLog: (api: 'AirService' | 'LodgingService' | 'ConciergeRegistry', endpoint: string, request: any, response: any) => void;
}

export const BlogSystem: React.FC<BlogSystemProps> = ({ triggerApiLog }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Author Portal States
  const [isAuthorLoggedIn, setIsAuthorLoggedIn] = useState(false);
  const [loggedInStaff, setLoggedInStaff] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorPassword, setAuthorPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // CRUD Dashboard States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategory, setFormCategory] = useState<'aviation' | 'lodging' | 'gastronomy' | 'experience'>('experience');
  const [formAuthor, setFormAuthor] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formError, setFormError] = useState('');

  // Initial load
  useEffect(() => {
    const savedPosts = localStorage.getItem('luxetravel_blog_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts(initialBlogPosts);
      }
    } else {
      setPosts(initialBlogPosts);
      localStorage.setItem('luxetravel_blog_posts', JSON.stringify(initialBlogPosts));
    }

    // Check author session
    const authorSession = localStorage.getItem('luxetravel_author_session');
    if (authorSession) {
      setIsAuthorLoggedIn(true);
      const matched = STAFF_CREDENTIALS.find(s => s.email.toLowerCase() === authorSession.toLowerCase());
      if (matched) {
        setLoggedInStaff(matched);
      } else {
        setLoggedInStaff(AUTHOR_CREDENTIALS);
      }
    }
  }, []);

  // Sync to localStorage
  const syncPosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('luxetravel_blog_posts', JSON.stringify(updatedPosts));
  };

  // SEO Meta and JSON-LD structured schema script injector
  useEffect(() => {
    let schemaScript = document.getElementById('ld-schema-blog');

    if (selectedPost) {
      // 1. Update title
      document.title = `${selectedPost.title} | LuxeTravel Editorial`;

      // 2. Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', selectedPost.description);

      // 3. Inject JSON-LD structured schema script
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'ld-schema-blog';
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        },
        "headline": selectedPost.title,
        "description": selectedPost.description,
        "image": selectedPost.image,
        "datePublished": selectedPost.publishedDate,
        "author": {
          "@type": "Person",
          "name": selectedPost.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "LuxeTravel Curations",
          "logo": {
            "@type": "ImageObject",
            "url": "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800"
          }
        }
      });
    } else {
      // Restore default SEO settings
      document.title = "Luxury Insights & Editorial Magazine | LuxeTravel";
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', "Explore luxury travel journals, first-class private charter reviews, Maldives overwater villa diaries, and Michelin-starred culinary stories.");
      }

      if (schemaScript) {
        schemaScript.remove();
      }
    }

    return () => {
      // Cleanup on component unmount
      const schemaScriptOnClean = document.getElementById('ld-schema-blog');
      if (schemaScriptOnClean) {
        schemaScriptOnClean.remove();
      }
    };
  }, [selectedPost]);

  // Handle Author Login
  const handleAuthorLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = STAFF_CREDENTIALS.find(
      s => s.email.toLowerCase() === authorEmail.toLowerCase() && s.password === authorPassword
    );
    if (matched) {
      setIsAuthorLoggedIn(true);
      setLoggedInStaff(matched);
      setLoginError('');
      setIsLoginModalOpen(false);
      localStorage.setItem('luxetravel_author_session', matched.email);
      
      // Log editorial registry API check in Sandbox
      triggerApiLog(
        'ConciergeRegistry',
        'POST /editorial/auth/login',
        { email: authorEmail, action: 'editorial_dashboard_access' },
        { status: 'authenticated', author: matched.name, role: matched.role, permissions: ['create_posts', 'edit_posts', 'delete_posts'] }
      );
    } else {
      setLoginError('Invalid editorial staff credentials.');
      triggerApiLog(
        'ConciergeRegistry',
        'POST /editorial/auth/login (FAILED)',
        { email: authorEmail },
        { error: 'Unauthorized', message: 'Invalid credentials provided for editorial portal.' }
      );
    }
  };

  const handleAuthorLogout = () => {
    setIsAuthorLoggedIn(false);
    setIsEditorOpen(false);
    setLoggedInStaff(null);
    localStorage.removeItem('luxetravel_author_session');
  };

  // Open Form to Create
  const handleOpenCreateForm = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormDescription('');
    setFormContent('');
    setFormImage('');
    setFormCategory('experience');
    setFormAuthor(loggedInStaff ? loggedInStaff.name : AUTHOR_CREDENTIALS.name);
    setFormTags('');
    setFormError('');
    setIsEditorOpen(true);
  };

  // Open Form to Edit
  const handleOpenEditForm = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormDescription(post.description);
    setFormContent(post.content);
    setFormImage(post.image);
    setFormCategory(post.category);
    setFormAuthor(post.author);
    setFormTags(post.tags.join(', '));
    setFormError('');
    setIsEditorOpen(true);
  };

  // Submit Create / Edit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim() || !formContent.trim() || !formImage.trim() || !formAuthor.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const tagsArray = formTags
      ? formTags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const calculatedReadTime = `${Math.max(1, Math.ceil(formContent.split(/\s+/).length / 200))} min read`;

    if (editingPost) {
      // Edit Post
      const updated = posts.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title: formTitle,
            description: formDescription,
            content: formContent,
            image: formImage,
            category: formCategory,
            author: formAuthor,
            tags: tagsArray,
            readTime: calculatedReadTime
          };
        }
        return p;
      });
      syncPosts(updated);
      setIsEditorOpen(false);
      setEditingPost(null);
      
      triggerApiLog(
        'ConciergeRegistry',
        `PATCH /editorial/articles/${editingPost.id}`,
        { article_id: editingPost.id, updated_fields: ['title', 'content', 'tags'] },
        { status: 'updated', timestamp: new Date().toISOString() }
      );
    } else {
      // Create Post
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        content: formContent,
        image: formImage,
        category: formCategory,
        author: formAuthor,
        publishedDate: new Date().toISOString().split('T')[0],
        readTime: calculatedReadTime,
        tags: tagsArray
      };
      syncPosts([newPost, ...posts]);
      setIsEditorOpen(false);
      
      triggerApiLog(
        'ConciergeRegistry',
        'POST /editorial/articles',
        { title: formTitle, author: formAuthor, category: formCategory },
        { status: 'created', article_id: newPost.id, sync: 'localStorage' }
      );
    }
  };

  // Delete Post
  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this luxury article?")) {
      const updated = posts.filter(p => p.id !== id);
      syncPosts(updated);
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
      
      triggerApiLog(
        'ConciergeRegistry',
        `DELETE /editorial/articles/${id}`,
        { article_id: id },
        { status: 'deleted', sync: 'localStorage' }
      );
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="luxury-container animate-fade-in" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Blog Detail Inspector View */}
      {selectedPost ? (
        <article className="glass-panel" style={{
          padding: '3rem',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '850px',
          margin: '2rem auto',
          position: 'relative'
        }}>
          {/* Back button */}
          <button
            id="btn-blog-back"
            onClick={() => setSelectedPost(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            Back to Editorial Hub
          </button>

          {/* Article Header details */}
          <header style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="gold-badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', textTransform: 'uppercase' }}>
                {selectedPost.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={12} /> {selectedPost.readTime}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} /> {selectedPost.publishedDate}
              </span>
            </div>

            <h1 style={{
              fontSize: '2.8rem',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: 'var(--color-text-primary)',
              marginBottom: '1.5rem'
            }}>
              {selectedPost.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(223, 195, 132, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(223, 195, 132, 0.3)'
              }}>
                <User size={14} style={{ color: 'var(--color-gold)' }} />
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Written by <span style={{ color: 'var(--color-text-primary)' }}>{selectedPost.author}</span>
              </span>
            </div>
          </header>

          {/* Large cover image */}
          <div style={{
            width: '100%',
            height: '380px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '2.5rem'
          }}>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>

          {/* Main Article Body Text */}
          <section className="article-body" style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1.15rem',
            lineHeight: 1.75,
            fontFamily: 'var(--font-sans)',
            whiteSpace: 'pre-line'
          }}>
            {selectedPost.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={index} style={{
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.6rem',
                    fontWeight: 400,
                    marginTop: '2rem',
                    marginBottom: '1rem'
                  }}>
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              return (
                <p key={index} style={{ marginBottom: '1.5rem' }}>
                  {paragraph}
                </p>
              );
            })}
          </section>

          {/* Tags Footer details */}
          <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <Tag size={14} style={{ color: 'var(--color-gold)', marginRight: '0.25rem' }} />
              {selectedPost.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* If logged in, provide author edit option right on post */}
            {isAuthorLoggedIn && (
              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', borderTop: '1px dashed var(--color-border)', paddingTop: '1.5rem' }}>
                <button
                  id={`btn-post-edit-${selectedPost.id}`}
                  onClick={() => handleOpenEditForm(selectedPost)}
                  className="btn-primary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Edit3 size={14} /> Edit Post
                </button>
                <button
                  id={`btn-post-delete-${selectedPost.id}`}
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Trash2 size={14} /> Delete Post
                </button>
              </div>
            )}
          </footer>
        </article>
      ) : (
        /* Blog Main Dashboard / Grid View */
        <div>
          {/* Header block */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                LuxeTravel Magazine
              </span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', fontWeight: 400, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
                Luxury Insights
              </h1>
            </div>

            {/* Author dashboard top actions */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {isAuthorLoggedIn ? (
                <>
                  {loggedInStaff && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginRight: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                        {loggedInStaff.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        {loggedInStaff.role}
                      </span>
                    </div>
                  )}
                  <button
                    id="btn-blog-create"
                    onClick={handleOpenCreateForm}
                    className="btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Plus size={16} /> New Article
                  </button>
                  <button
                    id="btn-blog-logout"
                    onClick={handleAuthorLogout}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                  >
                    Staff Logout
                  </button>
                </>
              ) : (
                <button
                  id="btn-blog-login-trigger"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn-secondary"
                  style={{
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderColor: 'rgba(255,255,255,0.08)'
                  }}
                >
                  <LogIn size={14} /> Editorial Login
                </button>
              )}
            </div>
          </div>

          {/* Search bar and Filters */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '3rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            {/* Categories pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Articles' },
                { id: 'aviation', label: 'Private Aviation' },
                { id: 'lodging', label: 'Exclusive Stays' },
                { id: 'gastronomy', label: 'Gastronomy' },
                { id: 'experience', label: 'Experiences' }
              ].map(cat => (
                <button
                  key={cat.id}
                  id={`btn-filter-blog-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: selectedCategory === cat.id ? 'var(--grad-gold)' : 'transparent',
                    border: selectedCategory === cat.id ? 'none' : '1px solid var(--color-border)',
                    color: selectedCategory === cat.id ? '#060608' : 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Keyword Search inputs */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <input
                id="input-blog-search"
                type="text"
                placeholder="Search articles & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#09090c',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  padding: '0.55rem 1rem 0.55rem 2.5rem',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
              />
              <Search size={16} style={{
                position: 'absolute',
                left: '0.95rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              {searchQuery && (
                <X 
                  size={14} 
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--color-text-muted)' }} 
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>
          </div>

          {/* Articles listing grids */}
          {filteredPosts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <BookOpen size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>No Articles Found</h3>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem' }}>
                We could not find any luxury editorial matches. Adjust your filters or keywords.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2.5rem'
            }}>
              {filteredPosts.map(post => (
                <article
                  key={post.id}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '100%',
                    position: 'relative',
                    transition: 'var(--transition-smooth)'
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Card Cover Image */}
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
                      className="card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    
                    {/* Top badges */}
                    <span 
                      className="gold-badge" 
                      style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        left: '1rem', 
                        fontSize: '0.65rem', 
                        padding: '0.15rem 0.5rem',
                        zIndex: 2
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Card content bodies */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    
                    {/* Article metadata */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={11} /> {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{post.publishedDate}</span>
                    </div>

                    <h3 style={{
                      fontSize: '1.35rem',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      lineHeight: 1.3,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.75rem'
                    }}>
                      {post.title}
                    </h3>

                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.description}
                    </p>

                    <div style={{ 
                      marginTop: 'auto', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      paddingTop: '0.75rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        By {post.author}
                      </span>
                      
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Read Article →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editorial Login Modal overlays */}
      {isLoginModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            position: 'relative'
          }}>
            <button
              id="btn-login-close"
              onClick={() => setIsLoginModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 400 }}>Editorial Registry</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                LuxeTravel publishing staff access gateway
              </p>
            </div>

            <form onSubmit={handleAuthorLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Editorial Email
                </label>
                <input
                  id="input-author-email"
                  type="email"
                  required
                  placeholder="editor@luxurymytravel.com"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Staff Password
                </label>
                <input
                  id="input-author-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authorPassword}
                  onChange={(e) => setAuthorPassword(e.target.value)}
                  style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    padding: '0.6rem 0.8rem',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {loginError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              <button
                id="btn-login-submit"
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', fontWeight: 600 }}
              >
                Authenticate & Enter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Editorial Creator / Editor Modal Panel */}
      {isEditorOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '90%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            position: 'relative'
          }}>
            <button
              id="btn-editor-close"
              onClick={() => setIsEditorOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
                {editingPost ? 'Edit Editorial Curation' : 'Publish New Luxury Editorial'}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                Store directly in persistent traveler directories
              </p>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '250px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Article Title *</label>
                  <input
                    id="input-editor-title"
                    type="text"
                    required
                    placeholder="e.g. Flight Suite Reviews"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={{
                      background: '#09090c',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Category */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%', maxWidth: '200px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Category *</label>
                  <select
                    id="select-editor-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    style={{
                      background: '#09090c',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.9rem',
                      outline: 'none',
                      height: '37px'
                    }}
                  >
                    <option value="aviation">Private Aviation</option>
                    <option value="lodging">Exclusive Stays</option>
                    <option value="gastronomy">Gastronomy</option>
                    <option value="experience">Experiences</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cover Image URL *</label>
                <input
                  id="input-editor-image"
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Author Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Author Name *</label>
                  <input
                    id="input-editor-author"
                    type="text"
                    required
                    placeholder="e.g. Jean-Pierre"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    style={{
                      background: '#09090c',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tags (comma separated)</label>
                  <input
                    id="input-editor-tags"
                    type="text"
                    placeholder="Jet, Gulfstream, Yacht"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    style={{
                      background: '#09090c',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Short Description *</label>
                <textarea
                  id="input-editor-desc"
                  required
                  rows={2}
                  placeholder="Provide a compelling 1-2 sentence overview of the article..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'var(--font-sans)'
                  }}
                />
              </div>

              {/* Article Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Article Content * (Use '### Header Title' for section headings)</label>
                <textarea
                  id="input-editor-content"
                  required
                  rows={8}
                  placeholder="Step aboard the luxury airliner...&#10;&#10;### Section Title&#10;Detailed analysis of the flight acoustics..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  style={{
                    background: '#09090c',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.5
                  }}
                />
              </div>

              {formError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
                  {formError}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <button
                  id="btn-editor-submit"
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Send size={16} /> {editingPost ? 'Save Updates' : 'Publish Article'}
                </button>
                <button
                  id="btn-editor-cancel"
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditorOpen(false)}
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
