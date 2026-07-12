// src/utils/ciaData.js
// CIA Question Papers data — managed via Google Drive links.
// Edit the `driveUrl` values below to add or replace papers.
// Google Drive share link format: https://drive.google.com/file/d/FILE_ID/view

export const CIA_DATA = {
  1: {
    label: "1st Year",
    icon: "Ⅰ",
    semesters: {
      1: {
        label: "Semester 1",
        cia: {
          1: {
            label: "CIA 1",
            papers: [
              // {
              //   id: "cia-1-1-1-sample",
              //   subject: "Fundamentals of Python Programming",
              //   title: "CIA 1 - Python Programming",
              //   driveUrl: "https://drive.google.com/file/d/REPLACE_WITH_FILE_ID/view",
              //   uploadedDate: "2025-02-15",
              //   description: "CIA 1 examination question paper",
              // },
            ],
          },
          2: {
            label: "CIA 2",
            papers: [],
          },
        },
      },
      2: {
        label: "Semester 2",
        cia: {
          1: {
            label: "CIA 1",
            papers: [],
          },
          2: {
            label: "CIA 2",
            papers: [],
          },
        },
      },
    },
  },
  2: {
    label: "2nd Year",
    icon: "Ⅱ",
    semesters: {
      1: {
        label: "Semester 3",
        cia: {
          1: {
            label: "CIA 1",
            papers: [],
          },
          2: {
            label: "CIA 2",
            papers: [],
          },
        },
      },
      2: {
        label: "Semester 4",
        cia: {
          1: {
            label: "CIA 1",
            papers: [],
          },
          2: {
            label: "CIA 2",
            papers: [],
          },
        },
      },
    },
  },
  3: {
    label: "3rd Year",
    icon: "Ⅲ",
    semesters: {
      1: {
        label: "Semester 5",
        cia: {
          1: {
            label: "CIA 1",
            papers: [],
          },
          2: {
            label: "CIA 2",
            papers: [],
          },
        },
      },
      2: {
        label: "Semester 6",
        cia: {
          1: {
            label: "CIA 1",
            papers: [],
          },
          2: {
            label: "CIA 2",
            papers: [],
          },
        },
      },
    },
  },
};

// Helper: convert Google Drive view URL to direct download/embed URLs
export function getDriveViewUrl(driveUrl) {
  return driveUrl; // Already a view URL
}

export function getDriveDownloadUrl(driveUrl) {
  const match = driveUrl?.match(/\/file\/d\/([^/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return driveUrl;
}

export function getDriveEmbedUrl(driveUrl) {
  const match = driveUrl?.match(/\/file\/d\/([^/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return driveUrl;
}
