extern crate sdl2;

use sdl2::pixels::Color;

pub struct GuioraWindow {
	pub title: String,
	pub width: u32,
	pub height: u32,
	pub canvas: sdl2::render::Canvas<sdl2::video::Window>,
	pub event_pump: sdl2::EventPump,
	pub running: bool,
	pub mouse_x: i32,
	pub mouse_y: i32,
}

impl Drop for GuioraWindow {
	fn drop(&mut self) {
		println!("Dropping window");
	}
}


/**
 * Create a new window
 *
 * @param title (String) The title of the window
 * @param width (Int) The width of the window
 * @param height (Int) The height of the window
 * @return A pointer to the window
 */
#[no_mangle]
pub extern "C" fn window_create(title: *const i8, width: u32, height: u32) -> *mut GuioraWindow {
	let title = unsafe { std::ffi::CStr::from_ptr(title).to_string_lossy().into_owned() };
	let sdl_context = sdl2::init().unwrap();
	let video_subsystem = sdl_context.video().unwrap();
	let window = video_subsystem.window(&title, width, height)
		.position_centered()
		.opengl()
		.build()
		.unwrap();
	let canvas = window.into_canvas().build().unwrap();
	let event_pump = sdl_context.event_pump().unwrap();
	let mut guiora = GuioraWindow {
		title: title,
		width: width,
		height: height,
		canvas: canvas,
		event_pump: event_pump,
		running: true,
		mouse_x: 0,
		mouse_y: 0,
	};

	// Set the background color
	guiora.canvas.set_draw_color(Color::RGB(0, 0, 0));
	guiora.canvas.clear();
	guiora.canvas.present();

	// Return a pointer to the window
	Box::into_raw(Box::new(guiora))
}

#[no_mangle]
pub extern "C" fn window_destroy(window: *mut GuioraWindow) {
	unsafe {
		drop(Box::from_raw(window));
	}
}

#[no_mangle]
pub extern "C" fn window_render(window: *mut GuioraWindow) {
	unsafe {
		(*window).canvas.present();
	}
}

#[no_mangle]
pub extern "C" fn window_update(window: *mut GuioraWindow) {
	unsafe {
		println!("Mouse moved to ({}, {})", (*window).mouse_x, (*window).mouse_y);
		for event in (*window).event_pump.poll_iter() {
			match event {
				sdl2::event::Event::Quit {..} => {
					(*window).running = false;
					// Kill the window
					window_destroy(window);
				},
				sdl2::event::Event::MouseMotion { x, y, .. } => {
					(*window).mouse_x = x;
					(*window).mouse_y = y;
				},
				_ => {}
			}
		}
	}
}

#[no_mangle]
pub extern "C" fn window_draw_rect(window: *mut GuioraWindow, x: i32, y: i32, width: u32, height: u32) {
	unsafe {
		println!("Drawing rect at ({}, {})", x, y);
		println!("Drawing rect with width {} and height {}", width, height);
		(*window).canvas.set_draw_color(Color::RGB(255, 0, 0));
		(*window).canvas.fill_rect(sdl2::rect::Rect::new(x, y, width, height)).unwrap();
	}
}

#[no_mangle]
pub extern "C" fn window_clear(window: *mut GuioraWindow) {
	unsafe {
		(*window).canvas.clear();
	}
}

#[no_mangle]
pub extern "C" fn window_set_title(window: *mut GuioraWindow, title: *const i8) {
	let title = unsafe { std::ffi::CStr::from_ptr(title).to_string_lossy().into_owned() };
	unsafe {
		(*window).title = title;
	}
}

pub fn main() {
}