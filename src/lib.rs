extern crate sdl2;

use deno_bindgen::deno_bindgen;
use sdl2::pixels::Color;

pub struct GuioraWindow {
	pub title: String,
	pub width: u32,
	pub height: u32,
	pub running: bool,
	pub mouse: GuioraMouse,
	pub canvas: *mut sdl2::render::Canvas<sdl2::video::Window>,
	pub event_pump: *mut sdl2::EventPump,
}

#[deno_bindgen]
pub struct GuioraMouse {
	pub x: i32,
	pub y: i32,
}

#[deno_bindgen]
pub struct GuioraRect {
	pub x: i32,
	pub y: i32,
	pub width: u32,
	pub height: u32,
}

#[deno_bindgen]
pub struct GuioraColor {
	pub r: u8,
	pub g: u8,
	pub b: u8,
	pub a: u8,
}

#[deno_bindgen]
pub struct GuioraButton {
	pub rect: GuioraRect,
	pub color: GuioraColor,
	pub text: String,
}

impl Clone for GuioraMouse {
	fn clone(&self) -> GuioraMouse {
		GuioraMouse {
			x: self.x,
			y: self.y,
		}
	}
}
impl Copy for GuioraMouse {}

impl Drop for GuioraWindow {
	fn drop(&mut self) {
		println!("Dropping window");
	}
}

impl Drop for GuioraRect {
	fn drop(&mut self) {
		println!("Dropping rect");
	}
}

impl Drop for GuioraColor {
	fn drop(&mut self) {
		println!("Dropping color");
	}
}

impl Drop for GuioraButton {
	fn drop(&mut self) {
		println!("Dropping button");
	}
}

impl GuioraWindow {
	/**
	 * Create a new window
	 *
	 * @param title (String) The title of the window
	 * @param width (Int) The width of the window
	 * @param height (Int) The height of the window
	 * @return A pointer to the window
	 */
	#[no_mangle]
	pub fn new(_title: *const i8, width: u32, height: u32) -> *mut GuioraWindow {
		let title = unsafe { std::ffi::CStr::from_ptr(_title).to_string_lossy().into_owned() };

		let sdl_context = sdl2::init().unwrap();
		let video_subsystem = sdl_context.video().unwrap();
		let window = video_subsystem.window(&title, width, height)
			.position_centered()
			.opengl()
			.build()
			.unwrap();

		let canvas = window.into_canvas().build().unwrap();
		let event_pump = sdl_context.event_pump().unwrap();
		let guiora = GuioraWindow {
			title: title,
			width: width,
			height: height,
			canvas: Box::into_raw(Box::new(canvas)),
			event_pump: Box::into_raw(Box::new(event_pump)),
			running: true,
			mouse: GuioraMouse {
				x: 0,
				y: 0,
			},
		};

		// Set the background color
		unsafe {
			(*guiora.canvas).set_draw_color(Color::RGB(0, 0, 0));
			(*guiora.canvas).clear();
			(*guiora.canvas).present();
		}

		// Return a pointer to the window
		Box::into_raw(Box::new(guiora))
	}
	/**
	 * Get the X position of the mouse
	 *
	 * @return The X position of the mouse
	 */
	#[no_mangle]
	pub fn get_mouse_x(&self) -> i32 {
		// Return the mouse position
		self.mouse.x
	}
	/**
	 * Get the Y position of the mouse
	 *
	 * @return The Y position of the mouse
	 */
	#[no_mangle]
	pub fn get_mouse_y(&self) -> i32 {
		// Return the mouse position
		self.mouse.y
	}
	/**
	 * Set the draw color
	 *
	 * @param r (Int) The red value
	 * @param g (Int) The green value
	 * @param b (Int) The blue value
	 * @param a (Int) The alpha value
	 */
	#[no_mangle]
	pub fn set_draw_color(&mut self, r: u8, g: u8, b: u8, a: u8) {
		unsafe {
			(*self.canvas).set_draw_color(Color::RGBA(r, g, b, a));
		}
	}
	/**
	 * Draw a rectangle
	 *
	 * @param x (Int) The X position of the rectangle
	 * @param y (Int) The Y position of the rectangle
	 * @param width (Int) The width of the rectangle
	 * @param height (Int) The height of the rectangle
	 */
	#[no_mangle]
	pub fn draw_rect(&mut self, x: i32, y: i32, width: u32, height: u32) {
		unsafe {
			(*self.canvas).fill_rect(sdl2::rect::Rect::new(x, y, width, height)).unwrap();
		}
	}
	/**
	 * Check if the window is running
	 *
	 * @return True if the window is running
	 */
	#[no_mangle]
	pub fn is_running(&self) -> bool {
		self.running
	}
	/**
	 * Clear the window
	 */
	#[no_mangle]
	pub fn clear(&mut self) {
		unsafe {
			(*self.canvas).clear();
		}
	}
	/**
	 * Close the window
	 */
	#[no_mangle]
	pub fn close(&mut self) {
		self.running = false;
	}
	/**
	 * Render the window
	 */
	#[no_mangle]
	pub fn render(&mut self) {
		unsafe {
			(*self.canvas).set_draw_color(Color::RGB(0, 0, 0));
			(*self.canvas).present();
		}
	}
	/**
	 * Update the window
	 */
	#[no_mangle]
	pub fn update(&mut self) {
		// Update the mouse position
		let mouse_state = unsafe { (*self.event_pump).mouse_state() };
		self.mouse.x = mouse_state.x();
		self.mouse.y = mouse_state.y();

		// Update the window
		unsafe {
			for event in (*self.event_pump).poll_iter() {
				match event {
					sdl2::event::Event::Quit { .. } => {
						self.running = false;
					},
					_ => {}
				}
			}
		}
	}
}

pub fn main() {
}