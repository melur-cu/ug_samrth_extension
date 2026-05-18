(function () {
    const currentUrl = window.location.href;
  
    // Check if you're on the course-selection page
    if (currentUrl.includes("course-selection")) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
  
      if (token) {
        // Construct new URL
        const newUrl = `https://assamadmission.samarth.ac.in/index.php/academic/academic/create?token=${token}`;
        
        // Redirect after optional delay
        setTimeout(() => {
          window.location.href = newUrl;
        }, 1000); // 1 second delay (optional)
      }
    }
  })();
  