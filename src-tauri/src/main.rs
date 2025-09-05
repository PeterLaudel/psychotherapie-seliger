use tauri::Manager;
use std::process::Command;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      #[cfg(not(debug_assertions))]
      {
        // Start Next.js backend in production
        Command::new("node")
          .args(["server.js"]) // your custom Next.js start script
          .spawn()
          .expect("Failed to start Next.js server");
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
