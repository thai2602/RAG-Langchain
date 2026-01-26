import Blog from '../models/Blog.js';
import User from '../models/User.js';

// Tool definitions for LLM
export const blogTools = [
  {
    type: 'function',
    function: {
      name: 'create_blog',
      description: 'Tạo một bài blog mới với tiêu đề, nội dung, danh mục và tags. Sử dụng tool này khi người dùng yêu cầu tạo bài viết mới.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Tiêu đề của bài blog'
          },
          content: {
            type: 'string',
            description: 'Nội dung chi tiết của bài blog (ít nhất 200 từ)'
          },
          category: {
            type: 'string',
            description: 'Danh mục của bài blog. Có thể chọn từ các chủ đề đời sống (minimalism, time-management, morning-routine, work-life-balance, personal-finance, reading-habits, home-decor, gardening, sustainable-living, language-learning) hoặc các chủ đề truyền thống (technology, food, travel, health, lifestyle, business, education, entertainment, sports, science)'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Các tags liên quan đến bài blog (tối đa 5 tags)'
          }
        },
        required: ['title', 'content', 'category', 'tags']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_categories',
      description: 'Lấy danh sách tất cả các danh mục blog có sẵn',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_users',
      description: 'Lấy danh sách tất cả các tác giả (users) để chọn tác giả cho blog mới',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  }
];

// Tool execution functions
export async function executeBlogTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'create_blog':
        return await createBlog(toolInput);
      case 'get_categories':
        return await getCategories();
      case 'get_users':
        return await getUsers();
      default:
        return { error: `Tool ${toolName} not found` };
    }
  } catch (error) {
    return { error: error.message };
  }
}

// Implementation of create_blog tool
async function createBlog(input) {
  try {
    // Ignore author_id if provided - always use default author
    const { title, content, category, tags } = input;

    // Validation
    if (!title || title.trim().length === 0) {
      return { error: 'Tiêu đề không được để trống' };
    }

    if (!content || content.trim().length < 100) {
      return { error: 'Nội dung phải có ít nhất 100 ký tự' };
    }

    if (!category) {
      return { error: 'Danh mục không được để trống' };
    }

    // Validate category - accept both lifestyle and traditional categories
    const validCategories = [
      'minimalism', 'time-management', 'morning-routine', 'work-life-balance', 
      'personal-finance', 'reading-habits', 'home-decor', 'gardening', 
      'sustainable-living', 'language-learning',
      // Also accept traditional categories
      'technology', 'food', 'travel', 'health', 'lifestyle', 'business', 
      'education', 'entertainment', 'sports', 'science'
    ];

    const normalizedCategory = category.toLowerCase().trim();
    if (!validCategories.includes(normalizedCategory)) {
      return { 
        error: `Danh mục "${category}" không hợp lệ. Vui lòng chọn một trong các danh mục: ${validCategories.join(', ')}` 
      };
    }

    // Always use first user as default author
    const author = await User.findOne();
    if (!author) {
      return { error: 'Không có tác giả nào trong hệ thống. Vui lòng chạy seed script trước.' };
    }

    // Calculate read time (assuming 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create blog
    const blog = new Blog({
      title: title.trim(),
      content: content.trim(),
      excerpt: content.trim().substring(0, 150) + '...',
      author: author._id,
      category: normalizedCategory,
      tags: tags && Array.isArray(tags) ? tags.slice(0, 5) : [],
      coverImage: `https://picsum.photos/seed/${Date.now()}/800/400`,
      published: true,
      views: 0,
      likes: 0,
      readTime: readTime
    });

    await blog.save();

    // Add blog to author's blogs array
    author.blogs.push(blog._id);
    await author.save();

    return {
      success: true,
      message: `✅ Bài blog "${title}" đã được tạo thành công bởi ${author.fullName}!`,
      blog: {
        _id: blog._id,
        title: blog.title,
        category: blog.category,
        author: author.fullName,
        tags: blog.tags,
        readTime: readTime
      }
    };
  } catch (error) {
    console.error('Error in createBlog:', error);
    return { error: `Lỗi khi tạo blog: ${error.message}` };
  }
}

// Implementation of get_categories tool
async function getCategories() {
  const categories = [
    'minimalism',
    'time-management',
    'morning-routine',
    'work-life-balance',
    'personal-finance',
    'reading-habits',
    'home-decor',
    'gardening',
    'sustainable-living',
    'language-learning'
  ];

  return {
    success: true,
    categories: categories,
    message: `Có ${categories.length} danh mục đời sống có sẵn`
  };
}

// Implementation of get_users tool
async function getUsers() {
  try {
    const users = await User.find().select('_id username fullName email');

    return {
      success: true,
      users: users.map(u => ({
        _id: u._id,
        username: u.username,
        fullName: u.fullName,
        email: u.email
      })),
      message: `Có ${users.length} tác giả trong hệ thống`
    };
  } catch (error) {
    return { error: `Lỗi khi lấy danh sách tác giả: ${error.message}` };
  }
}
