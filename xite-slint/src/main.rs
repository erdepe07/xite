mod pdb;

#[cfg(feature = "pdb")]
fn calculate_interest() {
    let _principal: f64;
    let _rate: f64;
    let _month: i32;

}

#[cfg(feature = "pdb")]
fn read_msf(_inputfile: String) {
    pdb::read_msf_superblock(_inputfile.as_str()).unwrap();
}


#[cfg(debug)]
fn type_of<T>(_val: &T) -> &str {
    std::any::type_name::<T>()
}

fn main() {
    let _dm: &str = "Erfan";
    println!("Hello, {} !", _dm);

    let mut _input: String = String::new();
    std::io::stdin()
        .read_line(&mut _input)
        .expect("Failed to read line");
        
    println!("Hello again, {} !", _input.trim());
    
    println!("Input the pdb file here :");


    _input.clear();
    std::io::stdin()
    .read_line(&mut _input)
    .expect("Failed to read line");
    
    // pd::read_msf_superblock(_input.as_str()).unwrap();

    println!("Type of s is: {}", type_of(&_input));
    pdb::read_msf_superblock(_input.trim()).unwrap();
    
}