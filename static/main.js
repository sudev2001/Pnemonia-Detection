// Initialize toast container
const toast = window.toast;

// Form submission handler
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("dropzone-file");
  const file = fileInput.files[0];

  if (!file) {
    toast.error("Please select an image file first!");
    return;
  }

  // Check file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!validTypes.includes(file.type)) {
    toast.error("Please upload a valid image file (PNG, JPG, or JPEG)");
    return;
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size should be less than 5MB");
    return;
  }

  // Show loading toast
  const loadingToast = toast.loading("Analyzing X-ray image...");

  try {
    // Simulate API call (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update results section (replace with actual results)
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
            <div class="bg-green-50 p-4 rounded-lg">
                <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-bold text-green-700 mb-2">Analysis Complete</h3>
                <p class="text-green-600">Results show normal lung condition</p>
            </div>
        `;

    // Dismiss loading toast and show success
    toast.dismiss(loadingToast);
    toast.success("Analysis completed successfully!");
  } catch (error) {
    // Handle error
    toast.dismiss(loadingToast);
    toast.error("Error analyzing image. Please try again.");
    console.error("Error:", error);
  }
});

// File drag and drop handling
const dropZone = document.querySelector('label[for="dropzone-file"]');

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropZone.classList.add("bg-blue-100");
}

function unhighlight(e) {
  dropZone.classList.remove("bg-blue-100");
}

dropZone.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const file = dt.files[0];
  const fileInput = document.getElementById("dropzone-file");

  fileInput.files = dt.files;

  if (file) {
    toast.success("File uploaded successfully!");
  }
}

// Preview image after selection
document
  .getElementById("dropzone-file")
  .addEventListener("change", function (e) {
    if (e.target.files[0]) {
      toast.success("Image selected successfully!");
    }
  });
