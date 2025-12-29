// Forum data storage
let posts = [
    {
        id: 1,
        author: 'Post 1',
        content: 'Forums available today!',
        likes: 119,
        comments: [],
        timestamp: new Date(),
        liked: false
    }
];
let postIdCounter = 2;
let currentCommentPostId = null;
let reportTarget = null;
let allPosts = []; // Store all posts for search

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all posts
    allPosts = [...posts];
    
    // Create Post Modal
    const createPostTrigger = document.getElementById('createPostTrigger');
    const createPostModal = document.getElementById('createPostModal');
    const closeCreatePost = document.getElementById('closeCreatePost');
    const submitPost = document.getElementById('submitPost');
    
    // Comment Modal
    const commentModal = document.getElementById('commentModal');
    const closeCommentModal = document.getElementById('closeCommentModal');
    
    // Report Modal
    const reportModal = document.getElementById('reportModal');
    const closeReportModal = document.getElementById('closeReportModal');
    
    // Search
    const forumSearch = document.getElementById('forumSearch');
    
    // File inputs
    const addPhoto = document.getElementById('addPhoto');
    const addFile = document.getElementById('addFile');
    const photoInput = document.getElementById('photoInput');
    const fileInput = document.getElementById('fileInput');
    
    // Search functionality
    forumSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            searchPosts(searchTerm);
        }
    });
    
    function searchPosts(term) {
        const feed = document.getElementById('forumFeed');
        
        if (!term) {
            // Show all posts if search is empty
            displayPosts(allPosts);
            return;
        }
        
        // Filter posts that contain the search term
        const filteredPosts = allPosts.filter(post => 
            post.content.toLowerCase().includes(term) ||
            post.author.toLowerCase().includes(term)
        );
        
        displayPosts(filteredPosts);
    }
    
    function displayPosts(postsToDisplay) {
        const feed = document.getElementById('forumFeed');
        feed.innerHTML = '';
        
        if (postsToDisplay.length === 0) {
            feed.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">No posts found</p>';
            return;
        }
        
        postsToDisplay.forEach(post => {
            const postDiv = createPostElement(post);
            feed.appendChild(postDiv);
        });
    }
    
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'forum-post';
        postDiv.setAttribute('data-post-id', post.id);
        
        postDiv.innerHTML = `
            <div class="post-header">
                <img src="/static/profileavatar.png" alt="Avatar" class="post-avatar">
                <div class="post-info">
                    <h3>${post.author}</h3>
                    <p class="post-meta">Just now</p>
                </div>
                <button class="post-options" data-post-id="${post.id}">⋯</button>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.id === 1 ? '<img src="/static/forumsample.png" class="post-image">' : ''}
            </div>
            <div class="post-footer">
                <div class="post-stats">
                    <span class="likes-count">👍 ${post.likes}</span>
                    <span class="comments-count">${post.comments.length} comments</span>
                </div>
                <div class="post-actions">
                    <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" data-post-id="${post.id}">
                        <span class="icon">👍</span> Like
                    </button>
                    <button class="action-btn comment-btn" data-post-id="${post.id}">
                        <span class="icon">💬</span> Comment
                    </button>
                </div>
            </div>
        `;
        
        attachPostEvents(postDiv, post.id);
        return postDiv;
    }
    
    // Open create post modal
    createPostTrigger.addEventListener('click', function() {
        createPostModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    // Close create post modal
    closeCreatePost.addEventListener('click', closeCreatePostModal);
    
    createPostModal.addEventListener('click', function(e) {
        if (e.target === createPostModal) {
            closeCreatePostModal();
        }
    });
    
    function closeCreatePostModal() {
        createPostModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        document.getElementById('postContent').value = '';
        document.getElementById('postAttachments').innerHTML = '';
        photoInput.value = '';
        fileInput.value = '';
    }
    
    // Add photo/video
    addPhoto.addEventListener('click', function() {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', function(e) {
        handleFileSelection(e.target.files, 'media');
    });
    
    // Add file
    addFile.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        handleFileSelection(e.target.files, 'file');
    });
    
    function handleFileSelection(files, type) {
        const attachmentsDiv = document.getElementById('postAttachments');
        
        Array.from(files).forEach(file => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'attachment-preview';
            
            if (type === 'media' && file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                previewDiv.appendChild(img);
            } else {
                previewDiv.innerHTML = `<div style="padding:10px;background:#f0f0f0;border-radius:8px;">${file.name}</div>`;
            }
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'attachment-remove';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = function() {
                previewDiv.remove();
            };
            
            previewDiv.appendChild(removeBtn);
            attachmentsDiv.appendChild(previewDiv);
        });
    }
    
    // Submit post
    submitPost.addEventListener('click', function() {
        const content = document.getElementById('postContent').value.trim();
        const author = document.getElementById('postAuthor').value;
        
        if (!content) {
            alert('Please write something before posting!');
            return;
        }
        
        const validFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
        const fileList = fileInput.files;
        let invalidFiles = false;
        
        Array.from(fileList).forEach(file => {
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!validFileTypes.includes(ext)) {
                invalidFiles = true;
            }
        });
        
        if (invalidFiles) {
            alert('Invalid attachments!');
            return;
        }
        
        const newPost = {
            id: postIdCounter++,
            author: author === 'anonymous' ? 'Anonymous' : 'Username',
            content: content,
            likes: 0,
            comments: [],
            timestamp: new Date(),
            liked: false
        };
        
        posts.unshift(newPost);
        allPosts.unshift(newPost);
        
        const feed = document.getElementById('forumFeed');
        const postDiv = createPostElement(newPost);
        feed.insertBefore(postDiv, feed.firstChild);
        
        closeCreatePostModal();
    });
    
    // Attach events to post
    function attachPostEvents(postDiv, postId) {
        const likeBtn = postDiv.querySelector('.like-btn');
        const commentBtn = postDiv.querySelector('.comment-btn');
        const optionsBtn = postDiv.querySelector('.post-options');
        
        likeBtn.addEventListener('click', function() {
            toggleLike(postId);
        });
        
        commentBtn.addEventListener('click', function() {
            openCommentModal(postId);
        });
        
        optionsBtn.addEventListener('click', function(e) {
            showPostOptions(e, postId);
        });
    }
    
    // Show post options
    function showPostOptions(e, postId) {
        e.stopPropagation();
        
        document.querySelectorAll('.post-options-menu').forEach(menu => menu.remove());
        
        const menu = document.createElement('div');
        menu.className = 'post-options-menu';
        menu.innerHTML = '<button class="post-option-item">Report</button>';
        
        const rect = e.target.getBoundingClientRect();
        menu.style.top = rect.bottom + 5 + 'px';
        menu.style.left = rect.left + 'px';
        
        document.body.appendChild(menu);
        
        menu.querySelector('.post-option-item').addEventListener('click', function() {
            openReportModal('post', postId);
            menu.remove();
        });
        
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 0);
    }
    
    // Toggle like
    function toggleLike(postId) {
        const post = allPosts.find(p => p.id === postId);
        if (!post) return;
        
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        
        const postDiv = document.querySelector(`[data-post-id="${postId}"]`);
        const likeBtn = postDiv.querySelector('.like-btn');
        const likesCount = postDiv.querySelector('.likes-count');
        
        if (post.liked) {
            likeBtn.classList.add('liked');
        } else {
            likeBtn.classList.remove('liked');
        }
        
        likesCount.textContent = `👍 ${post.likes}`;
    }
    
    // Open comment modal
    function openCommentModal(postId) {
        currentCommentPostId = postId;
        const post = allPosts.find(p => p.id === postId);
        if (!post) return;
        
        const preview = document.getElementById('commentPostPreview');
        preview.innerHTML = `
            <div class="post-info">
                <h3>${post.author}</h3>
                <p>${post.content}</p>
            </div>
        `;
        
        renderComments(post.comments);
        commentModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Render comments
    function renderComments(comments) {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        comments.forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';
            commentDiv.innerHTML = `
                <img src="/static/profileavatar.png" alt="Avatar" class="comment-avatar">
                <div class="comment-content-wrapper">
                    <div class="comment-author-name">${comment.author}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions">
                        <button class="comment-like-btn ${comment.liked ? 'liked' : ''}" data-comment-index="${index}">
                            👍 ${comment.likes > 0 ? comment.likes : 'Like'}
                        </button>
                        <button class="comment-report-btn" data-comment-index="${index}">Report</button>
                    </div>
                </div>
            `;
            
            commentsList.appendChild(commentDiv);
            
            const likeBtn = commentDiv.querySelector('.comment-like-btn');
            likeBtn.addEventListener('click', function() {
                toggleCommentLike(index);
            });
            
            const reportBtn = commentDiv.querySelector('.comment-report-btn');
            reportBtn.addEventListener('click', function() {
                openReportModal('comment', currentCommentPostId, index);
            });
        });
    }
    
    // Toggle comment like
    function toggleCommentLike(commentIndex) {
        const post = allPosts.find(p => p.id === currentCommentPostId);
        const comment = post.comments[commentIndex];
        
        comment.liked = !comment.liked;
        comment.likes += comment.liked ? 1 : -1;
        
        renderComments(post.comments);
        updateCommentCount(post.id);
    }
    
    // Submit comment
    const submitComment = document.getElementById('submitComment');
    submitComment.addEventListener('click', function() {
        const commentText = document.getElementById('commentContent').value.trim();
        const commentAuthor = document.getElementById('commentAuthor').value;
        
        if (!commentText) {
            alert('Please write a comment!');
            return;
        }
        
        const post = allPosts.find(p => p.id === currentCommentPostId);
        const newComment = {
            author: commentAuthor === 'anonymous' ? 'Anonymous' : 'Username',
            text: commentText,
            likes: 0,
            liked: false
        };
        
        post.comments.push(newComment);
        renderComments(post.comments);
        updateCommentCount(post.id);
        
        document.getElementById('commentContent').value = '';
    });
    
    // Update comment count
    function updateCommentCount(postId) {
        const post = allPosts.find(p => p.id === postId);
        const postDiv = document.querySelector(`[data-post-id="${postId}"]`);
        if (!postDiv) return;
        const commentsCount = postDiv.querySelector('.comments-count');
        commentsCount.textContent = `${post.comments.length} comments`;
    }
    
    // Close comment modal
    closeCommentModal.addEventListener('click', closeCommentModalFunc);
    
    commentModal.addEventListener('click', function(e) {
        if (e.target === commentModal) {
            closeCommentModalFunc();
        }
    });
    
    function closeCommentModalFunc() {
        commentModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        document.getElementById('commentContent').value = '';
        currentCommentPostId = null;
    }
    
    // Report Modal
    function openReportModal(type, postId, commentIndex = null) {
        reportTarget = { type, postId, commentIndex };
        reportModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    closeReportModal.addEventListener('click', closeReportModalFunc);
    
    reportModal.addEventListener('click', function(e) {
        if (e.target === reportModal) {
            closeReportModalFunc();
        }
    });
    
    function closeReportModalFunc() {
        reportModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        reportTarget = null;
    }
    
    // Handle report option selection
    document.querySelectorAll('.report-option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reason = this.getAttribute('data-reason');
            
            console.log('Report submitted:', {
                target: reportTarget,
                reason: reason
            });
            
            alert('Thank you for your report. We will review this content shortly.');
            closeReportModalFunc();
        });
    });
    
    // Comment photo upload
    const addCommentPhoto = document.getElementById('addCommentPhoto');
    const commentPhotoInput = document.getElementById('commentPhotoInput');
    
    addCommentPhoto.addEventListener('click', function() {
        commentPhotoInput.click();
    });
    
    // Attach events to existing posts
    document.querySelectorAll('.post-options').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const postId = parseInt(this.getAttribute('data-post-id'));
            showPostOptions(e, postId);
        });
    });
    
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-post-id'));
            toggleLike(postId);
        });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-post-id'));
            openCommentModal(postId);
        });
    });
});