"use strict";
// ==========================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ==========================================
// ==========================================
// УТИЛИТЫ
// ==========================================
/**
 * Безопасное получение элемента по селектору с выбросом ошибки,
 * если элемент не найден (для критичных элементов).
 */
function queryRequired(selector, parent = document) {
    const el = parent.querySelector(selector);
    if (!el) {
        throw new Error(`Элемент не найден: ${selector}`);
    }
    return el;
}
/**
 * Безопасное получение элемента (возвращает null, если не найден).
 */
function queryOptional(selector, parent = document) {
    return parent.querySelector(selector);
}
/**
 * Экранирование HTML (защита от XSS).
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// ==========================================
// ТОЧКА ВХОДА
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const isModalPage = queryOptional('.modal-page') !== null;
    const isIndexPage = queryOptional('.post-2') !== null && !isModalPage;
    if (isIndexPage) {
        initIndexPage();
    }
    if (isModalPage) {
        initModalPage();
    }
});
// ==========================================
// ГЛАВНАЯ СТРАНИЦА (index.html)
// ==========================================
function initIndexPage() {
    // --- 1. Добавление нового поста ---
    const addBtn = queryRequired('.add-btn');
    const addInput = queryRequired('.add-input');
    addBtn.addEventListener('click', () => {
        const text = addInput.value.trim();
        if (text === '') {
            alert('Введите текст поста!');
            return;
        }
        createNewPost(text);
        addInput.value = '';
    });
    addInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
    // --- 2. Кнопка "Комментарии" для поста 1 ---
    const post1 = queryOptional('.post-1');
    if (post1) {
        const commentBtn = queryOptional('.btn-comment', post1);
        commentBtn?.addEventListener('click', () => {
            toggleCommentsForPost(post1);
        });
    }
    // --- 3. Удаление постов ---
    document
        .querySelectorAll('.post .btn-delete')
        .forEach((btn) => {
        btn.addEventListener('click', () => {
            const post = btn.closest('.post');
            if (post && confirm('Удалить этот пост?')) {
                post.remove();
            }
        });
    });
    // --- 4. Редактирование постов ---
    document
        .querySelectorAll('.post .btn-edit')
        .forEach((btn) => {
        btn.addEventListener('click', () => {
            const post = btn.closest('.post');
            if (!post)
                return;
            const textEl = queryOptional('.post-text', post);
            if (!textEl)
                return;
            const newText = prompt('Редактировать пост:', textEl.textContent?.trim() ?? '');
            if (newText !== null && newText.trim() !== '') {
                textEl.textContent = newText.trim();
            }
        });
    });
    // --- 5. Добавление комментария в посте 2 ---
    const post2 = queryOptional('.post-2');
    if (post2) {
        const addCommentBtn = queryOptional('.btn-add-comment', post2);
        const commentInput = queryOptional('.comment-input', post2);
        if (addCommentBtn && commentInput) {
            addCommentBtn.addEventListener('click', () => {
                const text = commentInput.value.trim();
                if (text === '') {
                    alert('Введите текст комментария!');
                    return;
                }
                addCommentToPost(post2, text);
                commentInput.value = '';
                updateCommentCount(post2);
            });
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addCommentBtn.click();
                }
            });
        }
    }
    // --- 6. Удаление комментариев (делегирование на документе) ---
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target instanceof HTMLButtonElement &&
            target.classList.contains('btn-delete-comment')) {
            const commentItem = target.closest('.comment-item');
            const post = target.closest('.post');
            if (commentItem && post) {
                commentItem.remove();
                updateCommentCount(post);
            }
        }
    });
    // --- 7. Кнопка "Спрятать" ---
    if (post2) {
        const hideBtn = queryOptional('.btn-hide', post2);
        hideBtn?.addEventListener('click', () => {
            hideCommentsForPost(post2);
        });
    }
}
// ==========================================
// СОЗДАНИЕ НОВОГО ПОСТА
// ==========================================
function createNewPost(text) {
    const container = queryRequired('.main-container');
    const posts = document.querySelectorAll('.post');
    // Вычисляем позицию для нового поста (под последним)
    let top = 177;
    posts.forEach((p) => {
        const computed = getComputedStyle(p);
        const pTop = parseInt(p.style.top || computed.top, 10) || 0;
        const pHeight = p.offsetHeight;
        if (pTop + pHeight + 30 > top) {
            top = pTop + pHeight + 30;
        }
    });
    const newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.style.cssText = `height: 203px; left: 320px; top: ${top}px;`;
    newPost.innerHTML = `
        <div class="post-rectangle"></div>
        <div class="post-text">${escapeHtml(text)}</div>
        <div class="post-line"></div>
        <div class="post-actions">
            <button class="btn btn-blue btn-comment">Комментарии</button>
            <span class="comment-count">Количество комментарий - 0</span>
            <button class="btn btn-blue btn-edit">Изменить</button>
            <button class="btn btn-pink btn-delete">Удалить</button>
        </div>
    `;
    container.appendChild(newPost);
    attachPostEvents(newPost);
}
// ==========================================
// ПРИКРЕПЛЕНИЕ СОБЫТИЙ К ПОСТУ
// ==========================================
function attachPostEvents(post) {
    // Удалить пост
    queryOptional('.btn-delete', post)?.addEventListener('click', () => {
        if (confirm('Удалить этот пост?')) {
            post.remove();
        }
    });
    // Изменить пост
    queryOptional('.btn-edit', post)?.addEventListener('click', () => {
        const textEl = queryOptional('.post-text', post);
        if (!textEl)
            return;
        const newText = prompt('Редактировать пост:', textEl.textContent?.trim() ?? '');
        if (newText !== null && newText.trim() !== '') {
            textEl.textContent = newText.trim();
        }
    });
    // Показать/скрыть комментарии
    queryOptional('.btn-comment', post)?.addEventListener('click', () => {
        toggleCommentsForPost(post);
    });
}
// ==========================================
// ПЕРЕКЛЮЧЕНИЕ КОММЕНТАРИЕВ (свернуть/развернуть)
// ==========================================
function toggleCommentsForPost(post) {
    // Если пост уже развёрнут - сворачиваем
    if (post.classList.contains('post-2') || post.dataset.expanded === 'true') {
        hideCommentsForPost(post);
        return;
    }
    // Разворачиваем пост
    post.dataset.expanded = 'true';
    post.classList.remove('post-1', 'post-3');
    post.classList.add('post-2');
    post.style.height = 'auto';
    post.style.minHeight = '441px';
    // Форма добавления комментария
    const addForm = document.createElement('div');
    addForm.className = 'add-comment-form';
    addForm.innerHTML = `
        <input type="text" class="comment-input" placeholder="Новый комментарий ...">
        <button class="btn btn-blue btn-add-comment">Добавить</button>
    `;
    // Кнопка "Спрятать"
    const hideBtn = document.createElement('button');
    hideBtn.className = 'btn btn-blue btn-hide';
    hideBtn.textContent = 'Спрятать';
    // Вставляем после .post-line
    const line = queryOptional('.post-line', post);
    if (!line)
        return;
    line.after(addForm);
    // Вставляем кнопку "Спрятать" в конец поста
    post.appendChild(hideBtn);
    // Обновляем счётчик, если комментариев нет
    if (!queryOptional('.comment-item', post)) {
        const countEl = queryOptional('.comment-count', post);
        if (countEl) {
            countEl.textContent = 'Количество комментарий - 0';
        }
    }
    // Прикрепляем события
    const commentInput = queryRequired('.comment-input', addForm);
    const addCommentBtn = queryRequired('.btn-add-comment', addForm);
    addCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text === '') {
            alert('Введите текст комментария!');
            return;
        }
        addCommentToPost(post, text);
        commentInput.value = '';
        updateCommentCount(post);
    });
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCommentBtn.click();
        }
    });
    hideBtn.addEventListener('click', () => {
        hideCommentsForPost(post);
    });
}
// ==========================================
// СКРЫТИЕ КОММЕНТАРИЕВ (свернуть пост)
// ==========================================
function hideCommentsForPost(post) {
    post.dataset.expanded = 'false';
    post.classList.remove('post-2');
    post.classList.add('post-1');
    post.style.height = '203px';
    post.style.minHeight = '';
    // Удаляем форму добавления комментария
    queryOptional('.add-comment-form', post)?.remove();
    // Удаляем кнопку "Спрятать"
    queryOptional('.btn-hide', post)?.remove();
    // Удаляем все комментарии
    post.querySelectorAll('.comment-item').forEach((el) => el.remove());
    // Обновляем счётчик
    updateCommentCount(post);
}
// ==========================================
// ДОБАВЛЕНИЕ КОММЕНТАРИЯ
// ==========================================
function addCommentToPost(post, text) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.innerHTML = `
        <div class="comment-rectangle"></div>
        <div class="comment-text">${escapeHtml(text)}</div>
        <button class="btn btn-pink btn-delete-comment">Удалить</button>
    `;
    // Вставляем перед кнопкой "Спрятать", если она есть, иначе в конец
    const hideBtn = queryOptional('.btn-hide', post);
    if (hideBtn) {
        hideBtn.before(commentItem);
    }
    else {
        post.appendChild(commentItem);
    }
}
// ==========================================
// ОБНОВЛЕНИЕ СЧЁТЧИКА КОММЕНТАРИЕВ
// ==========================================
function updateCommentCount(post) {
    const count = post.querySelectorAll('.comment-item').length;
    const countEl = queryOptional('.comment-count', post);
    if (countEl) {
        countEl.textContent = `Количество комментарий - ${count}`;
    }
}
// ==========================================
// СТРАНИЦА С МОДАЛЬНЫМ ОКНОМ (modal.html)
// ==========================================
function initModalPage() {
    // --- 1. Кнопка "Подтвердить" ---
    queryOptional('.btn-confirm')?.addEventListener('click', () => {
        const modalText = queryOptional('.modal-input-text');
        const content = modalText?.textContent?.trim() ?? '';
        alert(`Изменения подтверждены!\n\n${content}`);
        closeModal();
    });
    // --- 2. Кнопка "Закрыть" ---
    queryOptional('.btn-close')?.addEventListener('click', () => {
        closeModal();
    });
    // --- 3. Закрытие по клику на оверлей ---
    const modalArea = queryOptional('.modal-area');
    if (modalArea) {
        modalArea.addEventListener('click', (e) => {
            if (e.target === modalArea) {
                closeModal();
            }
        });
    }
    // --- 4. Закрытие по Escape ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    // --- 5. Удаление постов на странице modal.html ---
    document
        .querySelectorAll('.modal-page .btn-delete')
        .forEach((btn) => {
        btn.addEventListener('click', () => {
            const post = btn.closest('.post');
            if (post && confirm('Удалить этот пост?')) {
                post.remove();
            }
        });
    });
    // --- 6. Редактирование постов на странице modal.html ---
    document
        .querySelectorAll('.modal-page .btn-edit')
        .forEach((btn) => {
        btn.addEventListener('click', () => {
            const post = btn.closest('.post');
            if (!post)
                return;
            const textEl = queryOptional('.post-text', post);
            if (!textEl)
                return;
            const newText = prompt('Редактировать пост:', textEl.textContent?.trim() ?? '');
            if (newText !== null && newText.trim() !== '') {
                textEl.textContent = newText.trim();
            }
        });
    });
}
// ==========================================
// ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
// ==========================================
function closeModal() {
    const modalArea = queryOptional('.modal-area');
    if (modalArea) {
        modalArea.style.display = 'none';
    }
}
//# sourceMappingURL=script.js.map