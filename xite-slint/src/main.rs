mod pd;

fn main() {
    let _dm: &str = "Erfan";
    println!("Hello, {} !", _dm);

    let mut _input: String = String::new();
    std::io::stdin()
        .read_line(&mut _input)
        .expect("Failed to read line");
        
    println!("Hello again, {} !", _input.trim());
    
    println!("Input the pdb file here :");
    std::io::stdin()
        .read_line(&mut _input)
        .expect("Failed to read line");
    pd::read_msf_superblock(_input.as_str()).unwrap();
    
}