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
  { category: 'technology', title: 'Machine Learning cơ bản', content: 'Machine Learning là nhánh của AI cho phép máy tính học từ dữ liệu mà không cần lập trình cụ thể. Có 3 loại chính: supervised learning (học có giám sát), unsupervised learning (học không giám sát), và reinforcement learning (học tăng cường). Ứng dụng rất đa dạng từ nhận diện hình ảnh, xử lý ngôn ngữ tự nhiên đến xe tự lái.', tags: ['AI', 'ML'] },
  { category: 'technology', title: 'Python cho beginners', content: 'Python là ngôn ngữ lập trình dễ học nhất. Cú pháp đơn giản, gần với ngôn ngữ tự nhiên. Ứng dụng rộng rãi: web development (Django, Flask), data science (NumPy, Pandas), machine learning (TensorFlow, PyTorch). Bắt đầu với biến, vòng lặp, hàm, OOP.', tags: ['Python', 'Programming'] },
  { category: 'food', title: 'Cách nấu Phở Việt Nam', content: 'Phở là món ăn truyền thống Việt Nam. Nước dùng trong, thơm từ xương hầm 8-10 tiếng. Gia vị: hành, gừng nướng, hồi, quế. Bánh phở mềm dai, thịt bò thái mỏng. Ăn kèm rau thơm, chanh, ớt.', tags: ['Phở', 'Vietnamese'] },
  { category: 'travel', title: 'Du lịch Đà Lạt', content: 'Đà Lạt thành phố ngàn hoa, khí hậu mát mẻ quanh năm. Địa điểm: Hồ Xuân Hương, Thung lũng Tình Yêu, Đồi Mộng Mơ. Đặc sản: dâu tây, atiso, rượu vang. Thời điểm đẹp: tháng 12-3.', tags: ['Đà Lạt', 'Travel'] },
  { category: 'health', title: 'Chăm sóc sức khỏe mùa đông', content: 'Mùa đông cần giữ ấm cơ thể, đặc biệt vùng cổ, ngực, bàn chân. Uống đủ nước, ăn nhiều vitamin C. Tập thể dục đều đặn. Ngủ đủ 7-8 tiếng. Rửa tay thường xuyên phòng bệnh.', tags: ['Health', 'Winter'] }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    const createdUsers = [];
    for (const userData of users) {
      const user = new User({
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=`&background=667eea&color=fff`
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ``);
    }

    let blogCount = 0;
    for (let i = 0; i < 10; i++) {
      for (const data of blogData) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const blog = new Blog({
          title: ` - Part ``,
          content: data.content,
          excerpt: data.content.substring(0, 150) + '...',
          author: randomUser._id,
          category: data.category,
          tags: data.tags,
          coverImage: `https://picsum.photos/seed/`/800/400`,
          views: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 100),
          featured: Math.random() > 0.8
        });
        await blog.save();
        randomUser.blogs.push(blog._id);
        await randomUser.save();
        blogCount++;
        console.log(`Created blog `: ``);
      }
    }

    console.log(`\nSeeding completed! Created ` users and ` blogs`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDatabase();
