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

document.addEventListener('DOMContentLoaded', function() {
    
    // Create Post Modal
    const createPostTrigger = document.getElementById('createPostTrigger');
    const createPostModal = document.getElementById('createPostModal');
    const closeCreatePost = document.getElementById('closeCreatePost');
    const submitPost = document.getElementById('submitPost');
    
    // Comment Modal
    const commentModal = document.getElementById('commentModal');
    const closeCommentModal = document.getElementById('closeCommentModal');
    
    // File inputs
    const addPhoto = document.getElementById('addPhoto');
    const addFile = document.getElementById('addFile');
    const photoInput = document.getElementById('photoInput');
    const fileInput = document.getElementById('fileInput');
    
    // Open create post modal
    createPostTrigger.addEventListener('click', function() {
        createPostModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    // Close create post modal
    closeCreatePost.addEventListener('click', closeCreatePostModal);
    
    // Close modal when clicking outside
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
    
    // Handle file selection
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
        
        // Validate attachments
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
        
        // Create new post
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
        addPostToFeed(newPost);
        closeCreatePostModal();
    });
    
    // Add post to feed
    function addPostToFeed(post) {
        const feed = document.getElementById('forumFeed');
        const postDiv = document.createElement('div');
        postDiv.className = 'forum-post';
        postDiv.setAttribute('data-post-id', post.id);
        
        postDiv.innerHTML = `
            <div class="post-header">
                <img src="/static/default-avatar.png" alt="Avatar" class="post-avatar">
                <div class="post-info">
                    <h3>${post.author}</h3>
                    <p class="post-meta">Just now</p>
                </div>
                <button class="post-options">⋯</button>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-footer">
                <div class="post-stats">
                    <span class="likes-count">👍 ${post.likes}</span>
                    <span class="comments-count">${post.comments.length} comments</span>
                </div>
                <div class="post-actions">
                    <button class="action-btn like-btn" data-post-id="${post.id}">
                        <span class="icon">👍</span> Like
                    </button>
                    <button class="action-btn comment-btn" data-post-id="${post.id}">
                        <span class="icon">💬</span> Comment
                    </button>
                </div>
            </div>
        `;
        
        feed.insertBefore(postDiv, feed.firstChild);
        attachPostEvents(postDiv, post.id);
    }
    
    // Attach events to post
    function attachPostEvents(postDiv, postId) {
        const likeBtn = postDiv.querySelector('.like-btn');
        const commentBtn = postDiv.querySelector('.comment-btn');
        
        likeBtn.addEventListener('click', function() {
            toggleLike(postId);
        });
        
        commentBtn.addEventListener('click', function() {
            openCommentModal(postId);
        });
    }
    
    // Toggle like
    function toggleLike(postId) {
        const post = posts.find(p => p.id === postId);
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
        const post = posts.find(p => p.id === postId);
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
                <img src="/static/default-avatar.png" alt="Avatar" class="comment-avatar">
                <div class="comment-content-wrapper">
                    <div class="comment-author-name">${comment.author}</div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions">
                        <button class="comment-like-btn ${comment.liked ? 'liked' : ''}" data-comment-index="${index}">
                            👍 ${comment.likes > 0 ? comment.likes : 'Like'}
                        </button>
                    </div>
                </div>
            `;
            
            commentsList.appendChild(commentDiv);
            
            const likeBtn = commentDiv.querySelector('.comment-like-btn');
            likeBtn.addEventListener('click', function() {
                toggleCommentLike(index);
            });
        });
    }
    
    // Toggle comment like
    function toggleCommentLike(commentIndex) {
        const post = posts.find(p => p.id === currentCommentPostId);
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
        
        const post = posts.find(p => p.id === currentCommentPostId);
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
        const post = posts.find(p => p.id === postId);
        const postDiv = document.querySelector(`[data-post-id="${postId}"]`);
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
    
    // Comment photo upload
    const addCommentPhoto = document.getElementById('addCommentPhoto');
    const commentPhotoInput = document.getElementById('commentPhotoInput');
    
    addCommentPhoto.addEventListener('click', function() {
        commentPhotoInput.click();
    });
    
    // Attach events to existing posts
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-post-id'));
            toggleLikeExisting(postId, this);
        });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-post-id'));
            openCommentModal(postId);
        });
    });
    
    // Toggle like for existing post
    function toggleLikeExisting(postId, btnElement) {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        
        const postDiv = document.querySelector(`[data-post-id="${postId}"]`);
        const likeBtn = postDiv.querySelector('.like-btn');
        const likesCount = postDiv.querySelector('.post-stats span:first-child');
        
        if (post.liked) {
            likeBtn.classList.add('liked');
        } else {
            likeBtn.classList.remove('liked');
        }
        
        likesCount.textContent = `👍 ${post.likes}`;
    }
});