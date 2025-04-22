document.addEventListener('DOMContentLoaded', () => {
  // Sidebar navigation
  const sidebarLinks = document.querySelectorAll('.settings-sidebar li');
  const sections = document.querySelectorAll('.settings-section');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.section;

      // Toggle sidebar active
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Toggle visible section
      sections.forEach(section => {
        section.classList.toggle('hidden', section.id !== target);
      });
    });
  });

  // Show/hide email/password forms
  document.querySelectorAll('.toggle-form-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      document.querySelectorAll('.settings-form').forEach(f => f.classList.add('hidden'));
      document.getElementById(targetId).classList.remove('hidden');
    });
  });

  // Delete modal logic
  document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    document.getElementById('deleteModal').classList.remove('hidden');
  });

  document.getElementById('cancelDelete').addEventListener('click', () => {
    document.getElementById('deleteModal').classList.add('hidden');
  });

  document.getElementById('confirmDelete').addEventListener('click', () => {
    alert('Account deletion initiated.');
    document.getElementById('deleteModal').classList.add('hidden');
  });
});
