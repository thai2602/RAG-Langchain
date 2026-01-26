import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog_database';

const users = [
  { username: 'nguyenvana', email: 'nguyenvana@example.com', password: 'password123', fullName: 'Nguyễn Văn A', bio: 'Lập trình viên Full-stack' },
  { username: 'tranthib', email: 'tranthib@example.com', password: 'password123', fullName: 'Trần Thị B', bio: 'Food blogger' },
  { username: 'levanc', email: 'levanc@example.com', password: 'password123', fullName: 'Lê Văn C', bio: 'Travel blogger' },
  { username: 'phamthid', email: 'phamthid@example.com', password: 'password123', fullName: 'Phạm Thị D', bio: 'Chuyên gia sức khỏe' },
  { username: 'hoangvane', email: 'hoangvane@example.com', password: 'password123', fullName: 'Hoàng Văn E', bio: 'Doanh nhân' }
];

const blogData = [
  { category: 'lifestyle', title: 'Minimalism - Sống tối giản để sống tốt hơn', content: 'Minimalism không chỉ là bỏ đi những thứ không cần thiết, mà là tập trung vào những gì thực sự quan trọng. Khi bạn sống tối giản, bạn có thêm thời gian, tiền bạc và năng lượng cho những điều thực sự có ý nghĩa. Bắt đầu bằng cách declutter phòng của bạn, bỏ đi những thứ bạn không dùng trong 6 tháng. Áp dụng nguyên tắc 80/20: 20% đồ vật của bạn được sử dụng 80% thời gian. Minimalism giúp giảm stress, tiết kiệm tiền và tập trung vào những gì thực sự quan trọng trong cuộc sống.', tags: ['lifestyle', 'minimalism', 'wellbeing'] },
  { category: 'lifestyle', title: 'Quản lý thời gian hiệu quả - Làm chủ cuộc sống của bạn', content: 'Thời gian là tài sản quý giá nhất. Để quản lý thời gian hiệu quả, bạn cần biết mình dành thời gian cho những gì. Sử dụng Pomodoro Technique: làm việc 25 phút, nghỉ 5 phút. Ưu tiên công việc quan trọng trước, không phải công việc khẩn cấp. Tạo to-do list hàng ngày với tối đa 3 mục tiêu chính. Loại bỏ những hoạt động lãng phí thời gian như cuộn mạng xã hội vô tận. Đặt ranh giới rõ ràng giữa thời gian làm việc và thời gian cá nhân. Quản lý thời gian tốt giúp bạn đạt được nhiều hơn với ít stress hơn.', tags: ['lifestyle', 'productivity', 'time-management'] },
  { category: 'lifestyle', title: 'Thói quen sáng - Bắt đầu ngày mới với năng lượng tích cực', content: 'Cách bạn bắt đầu buổi sáng quyết định cả ngày của bạn. Thức dậy sớm, tránh kiểm tra điện thoại ngay lập tức. Uống nước ấm với chanh để kích hoạt hệ tiêu hóa. Tập thể dục nhẹ hoặc yoga 15-20 phút để tăng năng lượng. Thiền hoặc viết nhật ký 10 phút để tập trung tâm trí. Ăn sáng lành mạnh với protein, carbs phức tạp và chất béo tốt. Lên kế hoạch cho ngày hôm nay với 3 mục tiêu chính. Thói quen sáng tốt tạo nền tảng cho một ngày thành công và hạnh phúc.', tags: ['lifestyle', 'morning-routine', 'habits'] },
  { category: 'lifestyle', title: 'Cân bằng cuộc sống - Work-life balance là chìa khóa hạnh phúc', content: 'Work-life balance không phải là chia đôi thời gian bằng nhau, mà là cảm thấy hài lòng với cả hai lĩnh vực. Đặt ranh giới rõ ràng: không làm việc sau 6 giờ chiều. Dành thời gian chất lượng cho gia đình và bạn bè. Có hoạt động yêu thích ngoài công việc. Học cách nói không với những yêu cầu không cần thiết. Tận hưởng kỳ nghỉ thực sự, không kiểm tra email công việc. Cân bằng giữa sự chăm sóc bản thân và trách nhiệm. Khi bạn cân bằng tốt, bạn sẽ hạnh phúc hơn, sản xuất hơn và sống lâu hơn.', tags: ['lifestyle', 'work-life-balance', 'wellbeing'] },
  { category: 'lifestyle', title: 'Tài chính cá nhân - Xây dựng nền tảng tài chính vững chắc', content: 'Tài chính cá nhân bắt đầu từ việc hiểu rõ tiền của bạn. Tạo ngân sách chi tiết: thu nhập, chi tiêu cố định, chi tiêu biến động, tiết kiệm. Áp dụng quy tắc 50/30/20: 50% cho nhu cầu, 30% cho muốn, 20% cho tiết kiệm. Xây dựng quỹ khẩn cấp 3-6 tháng chi phí sống. Trả hết nợ cao lãi trước. Bắt đầu đầu tư sớm, lợi suất kép là bạn của bạn. Học về chứng chỉ, cổ phiếu, bất động sản. Tài chính tốt mang lại tự do và bình yên tâm thần.', tags: ['lifestyle', 'finance', 'money-management'] },
  { category: 'lifestyle', title: 'Đọc sách mỗi ngày - Mở rộng tâm trí, mở rộng thế giới', content: 'Đọc sách là một trong những cách tốt nhất để học hỏi và phát triển bản thân. Đặt mục tiêu đọc 20-30 trang mỗi ngày, tương đương 1 cuốn sách mỗi tuần. Chọn sách đa dạng: tiểu thuyết, tự giúp, lịch sử, khoa học. Tạo không gian đọc thoải mái, yên tĩnh. Ghi chú những ý tưởng quan trọng. Tham gia book club để thảo luận. Đọc sách trước khi ngủ giúp thư giãn. Mỗi cuốn sách mở ra một thế giới mới, mở rộng kiến thức và khả năng sáng tạo.', tags: ['lifestyle', 'reading', 'personal-growth'] },
  { category: 'lifestyle', title: 'Trang trí nhà cửa - Tạo không gian sống yêu thích', content: 'Nhà cửa phản ánh tâm trí bạn. Trang trí nhà không cần tốn nhiều tiền. Chọn màu sắc hài hòa: màu trung tính làm nền, màu sáng làm điểm nhấn. Thêm cây xanh để làm sạch không khí và tạo sự sống động. Ánh sáng tự nhiên là tốt nhất, bổ sung bằng đèn ấm. Sắp xếp đồ đạc theo nguyên tắc minimalism. Thêm những bức tranh, ảnh gia đình yêu thích. Giữ nhà sạch sẽ, gọn gàng. Một nhà đẹp tạo tâm trạng tốt và năng suất cao.', tags: ['lifestyle', 'home-decor', 'interior-design'] },
  { category: 'lifestyle', title: 'Làm vườn tại nhà - Kết nối với thiên nhiên, trồng rau sạch', content: 'Làm vườn là hoạt động thư giãn, lành mạnh và tiết kiệm. Bắt đầu với những cây dễ trồng: cà chua, dưa chuột, rau mùi, hành. Chọn vị trí có ánh sáng mặt trời 6-8 giờ. Sử dụng đất chất lượng tốt và phân hữu cơ. Tưới nước đều đặn, sáng hoặc chiều. Kiểm tra sâu bệnh thường xuyên. Vườn nhà cung cấp rau sạch, tiết kiệm tiền, và mang lại niềm vui. Làm vườn cũng là cách tuyệt vời để giảm stress và kết nối với thiên nhiên.', tags: ['lifestyle', 'gardening', 'sustainable-living'] },
  { category: 'lifestyle', title: 'Sống bền vững - Bảo vệ trái đất, bảo vệ tương lai', content: 'Sống bền vững không phải là hoàn hảo, mà là cố gắng hàng ngày. Giảm sử dụng nhựa: mang túi vải, bình nước tái sử dụng, từ chối ống hút. Tái chế và tái sử dụng: quần áo cũ, đồ vật cũ. Tiết kiệm năng lượng: tắt đèn, sử dụng LED, máy lạnh ở 26-28°C. Ăn ít thịt, nhiều rau quả. Mua hàng địa phương, hữu cơ. Sử dụng phương tiện công cộng hoặc đi bộ. Mỗi hành động nhỏ cộng lại tạo thay đổi lớn cho trái đất.', tags: ['lifestyle', 'sustainability', 'eco-friendly'] },
  { category: 'lifestyle', title: 'Học ngoại ngữ - Mở cửa đến thế giới mới', content: 'Học ngoại ngữ mở ra cơ hội mới trong sự nghiệp và cuộc sống. Chọn ngôn ngữ bạn thực sự muốn học. Học 15-30 phút mỗi ngày, tốt hơn 2 giờ một lần. Sử dụng ứng dụng như Duolingo, Memrise, Babbel. Xem phim, nghe podcast, đọc sách bằng ngôn ngữ đó. Nói chuyện với người bản xứ qua Tandem hoặc ConversationExchange. Tham gia lớp học hoặc nhóm học. Đừng sợ sai lầm, đó là cách học. Học ngoại ngữ không chỉ là kỹ năng, mà là cửa vào những nền văn hóa mới.', tags: ['lifestyle', 'language-learning', 'personal-development'] }
];


console.log('Starting seed...');

// Generate 50 blogs from templates
function generateBlogs() {
  const categories = ['technology', 'food', 'travel', 'health', 'lifestyle', 'business', 'education', 'entertainment', 'sports', 'science'];
  const allBlogs = [];
  
  // Multiply existing blogs and modify them
  for (let i = 0; i < 10; i++) {
    blogData.forEach((blog, index) => {
      const newBlog = {
        ...blog,
        title: `${blog.title} - Phần ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        tags: [...blog.tags, `part${i+1}`]
      };
      allBlogs.push(newBlog);
    });
  }
  
  return allBlogs.slice(0, 50); // Take first 50
}

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = new User({
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=667eea&color=fff`
      });
      await user.save();
      createdUsers.push(user);
      console.log(`  ✓ Created user: ${user.fullName}`);
    }

    // Generate and create 50 blogs
    console.log('📝 Creating 50 blogs...');
    const blogs = generateBlogs();
    let blogCount = 0;
    
    // Create all blogs first
    const createdBlogs = [];
    for (const blogTemplate of blogs) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const blog = new Blog({
        title: blogTemplate.title,
        content: blogTemplate.content,
        excerpt: blogTemplate.content.substring(0, 150) + '...',
        author: randomUser._id,
        category: blogTemplate.category,
        tags: blogTemplate.tags,
        coverImage: `https://picsum.photos/seed/${blogCount}/800/400`,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 200),
        featured: Math.random() > 0.85
      });
      
      await blog.save();
      createdBlogs.push({ blog, userId: randomUser._id });
      
      blogCount++;
      if (blogCount % 10 === 0) {
        console.log(`  ✓ Created ${blogCount} blogs...`);
      }
    }
    
    // Update users with their blogs
    console.log('🔗 Linking blogs to users...');
    for (const { blog, userId } of createdBlogs) {
      await User.findByIdAndUpdate(userId, {
        $push: { blogs: blog._id }
      });
    }

    console.log(`\n🎉 Seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Users created: ${createdUsers.length}`);
    console.log(`   - Blogs created: ${blogCount}`);
    console.log(`\n✅ Database is ready to use!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
