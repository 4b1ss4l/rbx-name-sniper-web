# 🎯 [RBX Name Sniper](https://rbx-name-sniper-web.vercel.app/)

A powerful and user-friendly tool for finding available Roblox usernames. Generate and check thousands of username combinations with various generation methods and real-time availability checking.

![RBX Name Sniper](https://img.shields.io/badge/Roblox-Username%20Sniper-00A2FF?style=for-the-badge&logo=roblox)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎲 Multiple Generation Methods
- **Random**: Letters + numbers combination
- **Pronounceable**: Alternating consonants and vowels for readable names
- **Letters Only**: Pure alphabetic usernames
- **Letters + Underline**: Letters with single underscore (not at start/end)
- **Numbers + Underline**: Numbers with single underscore (not at start/end)
- **Letters + Numbers + Underline**: Mixed characters with single underscore
- **Numbers + Letters**: Mixed alphanumeric without underscores

### ⚡ Advanced Features
- **Real-time Validation**: Instant checking against Roblox's API
- **Configurable Parameters**: Set username length (3-20 characters)
- **Request Rate Limiting**: Adjustable delay to respect API limits
- **Progress Tracking**: Visual progress bar and detailed activity logs
- **Bulk Generation**: Generate up to 1000 usernames in one session
- **Export Results**: Download valid usernames as text file
- **Dark/Light Theme**: Toggle between themes for comfortable usage
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 🛡️ Smart Validation
- Follows Roblox username rules and restrictions
- Handles underscores properly (no leading/trailing, max 1 per name)
- Real-time availability checking with error handling
- Detailed logging of all generation attempts

## 🚀 Quick Start

### Online Usage
Visit the live application at: [Your Deployment URL]

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/4b1ss4l/rbxnamesniper.git
   cd rbxnamesniper
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Basic Usage
1. **Configure Parameters**
   - Set target number of usernames to find
   - Choose desired username length
   - Select generation method
   - Adjust request delay if needed
   - Set birthday for validation

2. **Start Generation**
   - Click "Start Generation" to begin
   - Monitor progress in real-time
   - View activity logs for detailed information

3. **Export Results**
   - Download valid usernames as a text file
   - Use the "Download" button when generation completes

### Generation Methods Explained

- **Random**: Best for general-purpose usernames
- **Pronounceable**: Creates more readable, memorable names
- **Letters Only**: For users who prefer pure alphabetic names
- **Underline Variants**: Adds visual separation while following Roblox rules
- **Mixed Methods**: Combines letters and numbers for variety

### Best Practices
- Use reasonable request delays (0.5-2 seconds) to avoid rate limiting
- Start with smaller target numbers to test your configuration
- Monitor the activity log for any API issues
- Save your results frequently during long generation sessions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **API**: Roblox Username Validation API
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
rbxusersniper/
├── app/
│   ├── api/validate/route.ts    # Username validation API
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── theme-provider.tsx       # Theme context
├── lib/
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🔧 API Reference

### Username Validation Endpoint

```
GET /api/validate?username=<name>&birthday=<yyyy-mm-dd>
```

**Parameters:**
- `username`: The username to validate
- `birthday`: User's birthday in YYYY-MM-DD format

**Response:**
```json
{
  "code": 0,        // 0 = available, 1 = taken, others = errors
  "message": "Username validation result"
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

RBX Name Sniper is an unofficial tool and is not affiliated with, endorsed by, or connected to Roblox Corporation. 

**Important Notes:**
- Use this tool responsibly and respect Roblox's Terms of Service
- Don't abuse the API with excessive requests
- The tool is for educational and legitimate username finding purposes
- We are not responsible for any account actions taken by Roblox

## 🙏 Support the Developer

If this tool helped you find great usernames, consider supporting the development:
- 💲 **Buy a gamepass** link on the website
- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** and suggest features
- 🔄 **Share** with friends who might find it useful
- 💻 **Contribute** code improvements

Your support helps keep this project free and continuously improved!

---

**Made with ❤️ by [4b1ss4l](https://github.com/4b1ss4l)**

*Happy username hunting! 🎯*

