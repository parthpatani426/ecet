// PDF Study Materials Management System
class PDFManager {
  constructor() {
    this.studyMaterials = this.initializeStudyMaterials();
    this.uploadedPDFs = [];
    this.init();
  }

  init() {
    this.loadUploadedPDFs();
  }

  // Initialize default study materials structure
  initializeStudyMaterials() {
    return {
      ece: {
        branch: 'Electronics & Communication Engineering',
        materials: [
          {
            id: 'ece-001',
            course: 'Digital Electronics Fundamentals',
            title: 'Binary Number System - Complete Guide',
            chapter: 1,
            fileName: 'digital-electronics-ch1.pdf',
            uploadDate: '2024-01-15',
            size: '2.5 MB',
            pages: 45,
            status: 'pending', // pending, uploaded, available
          },
          {
            id: 'ece-002',
            course: 'Digital Electronics Fundamentals',
            title: 'Logic Gates and Truth Tables',
            chapter: 2,
            fileName: 'digital-electronics-ch2.pdf',
            uploadDate: '2024-01-20',
            size: '3.2 MB',
            pages: 52,
            status: 'pending',
          },
          {
            id: 'ece-003',
            course: 'Circuit Theory & Analysis',
            title: 'Circuit Analysis Fundamentals',
            chapter: 1,
            fileName: 'circuit-theory-ch1.pdf',
            uploadDate: '2024-01-25',
            size: '4.1 MB',
            pages: 68,
            status: 'pending',
          },
        ],
      },
      eee: {
        branch: 'Electrical & Electronics Engineering',
        materials: [
          {
            id: 'eee-001',
            course: 'Power Systems Engineering',
            title: 'Power System Basics and Fundamentals',
            chapter: 1,
            fileName: 'power-systems-ch1.pdf',
            uploadDate: '2024-01-15',
            size: '3.8 MB',
            pages: 58,
            status: 'pending',
          },
          {
            id: 'eee-002',
            course: 'Power Systems Engineering',
            title: 'Grid Analysis and Distribution',
            chapter: 2,
            fileName: 'power-systems-ch2.pdf',
            uploadDate: '2024-01-20',
            size: '2.9 MB',
            pages: 44,
            status: 'pending',
          },
        ],
      },
      cme: {
        branch: 'Computer Science & Engineering',
        materials: [
          {
            id: 'cme-001',
            course: 'Data Structures & Algorithms',
            title: 'Arrays and Linked Lists',
            chapter: 1,
            fileName: 'dsa-ch1.pdf',
            uploadDate: '2024-01-15',
            size: '3.5 MB',
            pages: 65,
            status: 'pending',
          },
          {
            id: 'cme-002',
            course: 'Data Structures & Algorithms',
            title: 'Trees and Graphs',
            chapter: 2,
            fileName: 'dsa-ch2.pdf',
            uploadDate: '2024-01-22',
            size: '4.2 MB',
            pages: 72,
            status: 'pending',
          },
        ],
      },
      civil: {
        branch: 'Civil Engineering',
        materials: [
          {
            id: 'civil-001',
            course: 'Structural Analysis',
            title: 'Structural Design Principles',
            chapter: 1,
            fileName: 'structural-ch1.pdf',
            uploadDate: '2024-01-15',
            size: '5.1 MB',
            pages: 78,
            status: 'pending',
          },
        ],
      },
      mechanical: {
        branch: 'Mechanical Engineering',
        materials: [
          {
            id: 'mechanical-001',
            course: 'Thermodynamics',
            title: 'Thermodynamic Principles and Laws',
            chapter: 1,
            fileName: 'thermodynamics-ch1.pdf',
            uploadDate: '2024-01-15',
            size: '4.7 MB',
            pages: 89,
            status: 'pending',
          },
        ],
      },
    };
  }

  // Get materials by branch
  getMaterialsByBranch(branchId) {
    return this.studyMaterials[branchId] || null;
  }

  // Upload PDF (will be called from admin panel)
  async uploadPDF(file, metadata) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const pdfData = {
          id: `pdf-${Date.now()}`,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          uploadDate: new Date().toISOString(),
          type: file.type,
          data: reader.result, // Base64 encoded
          metadata: metadata,
          status: 'uploaded',
          timestamp: Date.now(),
        };

        this.uploadedPDFs.push(pdfData);
        this.saveToLocalStorage();

        ToastManager?.success(`PDF uploaded: ${file.name}`);
        resolve(pdfData);
      };

      reader.onerror = () => {
        ToastManager?.error('Error reading file');
        resolve(null);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Save to localStorage (for persistence)
  saveToLocalStorage() {
    try {
      localStorage.setItem(
        'ecetx-study-materials',
        JSON.stringify(this.uploadedPDFs)
      );
    } catch (error) {
      console.warn('localStorage quota exceeded:', error);
    }
  }

  // Load from localStorage
  loadUploadedPDFs() {
    try {
      const saved = localStorage.getItem('ecetx-study-materials');
      if (saved) {
        this.uploadedPDFs = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
  }

  // View/Download PDF
  viewPDF(pdfId) {
    const pdf = this.uploadedPDFs.find((p) => p.id === pdfId);
    if (!pdf) {
      ToastManager?.error('PDF not found');
      return;
    }

    // Create blob and open in new window
    const blob = new Blob([pdf.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // Download PDF
  downloadPDF(pdfId) {
    const pdf = this.uploadedPDFs.find((p) => p.id === pdfId);
    if (!pdf) {
      ToastManager?.error('PDF not found');
      return;
    }

    const blob = new Blob([pdf.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ToastManager?.success(`Downloaded: ${pdf.name}`);
  }

  // Mark material as available (admin function)
  markAsAvailable(materialId, branchId) {
    const branch = this.studyMaterials[branchId];
    if (!branch) return false;

    const material = branch.materials.find((m) => m.id === materialId);
    if (material) {
      material.status = 'available';
      return true;
    }
    return false;
  }

  // Get all available materials for a branch
  getAvailableMaterials(branchId) {
    const branch = this.getMaterialsByBranch(branchId);
    if (!branch) return [];
    return branch.materials.filter((m) => m.status === 'available');
  }

  // Get pending materials (for admin to upload)
  getPendingMaterials(branchId) {
    const branch = this.getMaterialsByBranch(branchId);
    if (!branch) return [];
    return branch.materials.filter((m) => m.status === 'pending');
  }

  // Get statistics
  getStatistics(branchId) {
    const branch = this.getMaterialsByBranch(branchId);
    if (!branch) return null;

    const materials = branch.materials;
    return {
      total: materials.length,
      available: materials.filter((m) => m.status === 'available').length,
      pending: materials.filter((m) => m.status === 'pending').length,
      totalPages: materials.reduce((sum, m) => sum + m.pages, 0),
      totalSize: materials.reduce(
        (sum, m) => sum + parseFloat(m.size),
        0
      ).toFixed(1),
    };
  }
}

// Initialize PDF Manager
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pdfManager = new PDFManager();
  });
} else {
  window.pdfManager = new PDFManager();
}
