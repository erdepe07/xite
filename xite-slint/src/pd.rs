use std::fs::File;
use std::io::{Read};
use std::convert::TryInto;

#[repr(C)]
#[derive(Debug)]
struct MsfSuperBlock {
    signature: [u8; 32],
    block_size: u32,
    free_block_map_block: u32,
    num_blocks: u32,
    num_directory_bytes: u32,
    unknown: u32,
    block_map_addr: u32,
}

pub fn read_msf_superblock(path: &str) -> std::io::Result<()> {
    let mut file = File::open(path)?;

    // Read 48-byte MSF superblock
    let mut buf = [0u8; 48];
    file.read_exact(&mut buf)?;

    // Parse fields manually (little-endian)
    let superblock = MsfSuperBlock {
        signature: buf[0..32].try_into().unwrap(),
        block_size: u32::from_le_bytes(buf[32..36].try_into().unwrap()),
        free_block_map_block: u32::from_le_bytes(buf[36..40].try_into().unwrap()),
        num_blocks: u32::from_le_bytes(buf[40..44].try_into().unwrap()),
        num_directory_bytes: u32::from_le_bytes(buf[44..48].try_into().unwrap()),
        unknown: 0, // placeholder
        block_map_addr: 0, // you must read next block for exact data
    };

    println!("MSF SuperBlock: {:?}", superblock);

    // Validate PDB header starts with "Microsoft C/C++ MSF 7.00"
    let signature_str = String::from_utf8_lossy(&superblock.signature);
    if signature_str.contains("Microsoft C/C++ MSF") {
        println!("✔ Valid PDB MSF header");
    } else {
        println!("✖ Not a valid PDB file");
    }

    Ok(())
}