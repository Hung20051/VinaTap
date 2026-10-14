const http = require('http');

async function makeRequest(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let respBody = '';
      res.on('data', chunk => respBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(respBody) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: respBody });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=== TEST 1: Đăng nhập Admin lấy token ===');
  const loginRes = await makeRequest('/api/auth/login', 'POST', {
    email: 'admin@vinatap.com',
    password: 'Admin@123'
  });
  if (loginRes.status !== 200 || !loginRes.data.token) {
    throw new Error('Đăng nhập admin thất bại: ' + JSON.stringify(loginRes));
  }
  const token = loginRes.data.token;
  console.log('✅ Đăng nhập Admin thành công!');

  console.log('\n=== TEST 2: Tạo bài viết mới (Create Article) ===');
  const testSlug = 'test-bai-viet-' + Date.now();
  const createRes = await makeRequest('/api/articles', 'POST', {
    slug: testSlug,
    category: 'things-to-do',
    province_slug: 'ha-noi',
    title_vi: 'Bài viết thử nghiệm kiểm thử tự động',
    title_en: 'Automated Test Article',
    hero_image: '/guide/megamenu/todo-2-hcmc.jpg',
    author_name: 'VinaTap QA',
    published_date: '2026-10-15',
    status: 'published',
    items: [
      {
        item_number: 1,
        title_vi: 'Mục thử nghiệm 1',
        title_en: 'Test Item 1',
        content_vi: ['Nội dung thử nghiệm mục 1'],
        content_en: ['Test content for item 1']
      }
    ]
  }, token);

  console.log('Tạo bài viết status:', createRes.status);
  if (createRes.status !== 201 || !createRes.data.article?.id) {
    throw new Error('Tạo bài viết thất bại: ' + JSON.stringify(createRes));
  }
  const articleId = createRes.data.article.id;
  console.log('✅ Tạo bài viết thành công với ID:', articleId, 'Slug:', testSlug);

  console.log('\n=== TEST 3: Đọc chi tiết bài viết (Get Article by Slug) ===');
  const getRes = await makeRequest(`/api/articles/${testSlug}`, 'GET', null, token);
  console.log('Đọc bài viết status:', getRes.status, 'Title VI:', getRes.data.article?.title_vi);
  if (getRes.status !== 200 || getRes.data.article?.id !== articleId) {
    throw new Error('Đọc bài viết thất bại');
  }
  console.log('✅ Lấy chi tiết bài viết thành công!');

  console.log('\n=== TEST 4: Sửa bài viết (Update Article) ===');
  const updateRes = await makeRequest(`/api/articles/${articleId}`, 'PUT', {
    slug: testSlug,
    category: 'eat-drink',
    title_vi: 'Bài viết thử nghiệm ĐÃ SỬA',
    title_en: 'Automated Test Article UPDATED',
    hero_image: '/guide/megamenu/eat-1-hanoi.jpg',
    author_name: 'VinaTap QA Updated',
    status: 'published',
    items: [
      {
        item_number: 1,
        title_vi: 'Mục đã sửa 1',
        title_en: 'Updated Item 1',
        content_vi: ['Nội dung đã được cập nhật thành công'],
        content_en: ['Updated content item 1']
      },
      {
        item_number: 2,
        title_vi: 'Mục mới thêm vào',
        title_en: 'Newly added item 2',
        content_vi: ['Nội dung mới'],
        content_en: ['New content']
      }
    ]
  }, token);

  console.log('Cập nhật status:', updateRes.status, 'Updated title:', updateRes.data.article?.title_vi);
  if (updateRes.status !== 200 || updateRes.data.article?.title_vi !== 'Bài viết thử nghiệm ĐÃ SỬA') {
    throw new Error('Cập nhật bài viết thất bại');
  }
  console.log('✅ Cập nhật bài viết thành công! Đã cập nhật 2 mục items.');

  console.log('\n=== TEST 5: Xóa bài viết (Delete Article) ===');
  const deleteRes = await makeRequest(`/api/articles/${articleId}`, 'DELETE', null, token);
  console.log('Xóa bài viết status:', deleteRes.status, deleteRes.data);
  if (deleteRes.status !== 200) {
    throw new Error('Xóa bài viết thất bại');
  }
  console.log('✅ Xóa bài viết thành công!');

  console.log('\n=== TEST 6: Kiểm tra xác nhận bài viết đã biến mất khỏi DB ===');
  const getAfterDelete = await makeRequest(`/api/articles/${testSlug}`, 'GET', null, token);
  console.log('Truy vấn lại sau xóa, status mong muốn 404:', getAfterDelete.status);
  if (getAfterDelete.status === 404) {
    console.log('✅ Đã xác nhận: Bài viết đã xóa hoàn toàn, không còn tồn tại trong DB!');
  } else {
    throw new Error('Bài viết vẫn còn sau khi xóa!');
  }

  console.log('\n🎉 TẤT CẢ TEST THÊM - SỬA - XÓA ĐỀU HOÀN TOÀN ỔN ĐỊNH VÀ CHUẨN XÁC 100%!');
})();
