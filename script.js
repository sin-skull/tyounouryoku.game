// サイドバーの開閉機能
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// 検索バーの機能
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value.trim();
  if (searchQuery) {
    // 検索処理を実装する
    console.log(`検索クエリ: ${searchQuery}`);
  }
});

// ユーザーアバターのドロップダウンメニュー
const userAvatar = document.querySelector('.user-avatar');
const dropdownMenu = document.createElement('div');
dropdownMenu.classList.add('dropdown-menu');

const menuItems = [
  { label: 'マイチャンネル', icon: 'fas fa-user' },
  { label: 'YouTubeスタジオ', icon: 'fas fa-video' },
  { label: '購読チャンネル', icon: 'fas fa-th' },
  { label: 'ライブラリ', icon: 'fas fa-book' },
  { label: '履歴', icon: 'fas fa-history' },
  { label: 'ご意見', icon: 'fas fa-comment' },
  { label: '設定', icon: 'fas fa-cog' },
  { label: 'ログアウト', icon: 'fas fa-sign-out-alt' }
];

menuItems.forEach(item => {
  const menuItem = document.createElement('div');
  menuItem.classList.add('dropdown-item');

  const menuIcon = document.createElement('i');
  menuIcon.classList.add(...item.icon.split(' '));

  const menuLabel = document.createElement('span');
  menuLabel.textContent = item.label;

  menuItem.appendChild(menuIcon);
  menuItem.appendChild(menuLabel);
  dropdownMenu.appendChild(menuItem);
});

userAvatar.addEventListener('click', () => {
  dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.user-avatar')) {
    dropdownMenu.classList.remove('show');
  }
});

document.body.appendChild(dropdownMenu);