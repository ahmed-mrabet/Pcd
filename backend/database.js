 import mysql from"mysql2"
 const pool = mysql.createPool({
     host: '127.0.0.1',
     port: '3306',
     database: 'e-health',
     user: 'root',
     password: 'root'
 }).promise();
export { pool };

export function generateWalletAddress(role) {
    switch (role) {
        case 'doctor':
            return "0x282d34Df86Bf49AbC52FEff14d0072bEE4EB5115";
        case 'patient':
            return "0x669a9c7e304EB24cfe479B484396D471C4A2EaB8";
        case 'pharmacist':
            return "0xa14ebb9bBF722f05A42370832600Efc13E4ae238";
        case 'insurance':
            return "0xd4686A9D503Dd44eBf5F3f8e795E705571aaaE55";
        default:
            return null;
    }
}

export async function registerUser(name, lastname, username, password, role) {
    try {
        switch (role) {
            case 'doctor':
                await pool.query(`
                    INSERT INTO doctor (doc_name, doc_lastname, username, password)
                    VALUES (?, ?, ?, ?)`, [name, lastname, username, password]);
                break;
            case 'patient':
                await pool.query(`
                    INSERT INTO patient (patient_name, patient_lastname, username, password)
                    VALUES (?, ?, ?, ?)`, [name, lastname, username, password]);
                break;
            case 'insurance':
                await pool.query(`
                    INSERT INTO insurance (inc_name, inc_lastname, username, password)
                    VALUES (?, ?, ?, ?)`, [name, lastname, username, password]);
                break;
            case 'pharmacy':
                await pool.query(`
                    INSERT INTO pharmacy (phar_name, phar_lastname, username, password)
                    VALUES (?, ?, ?, ?)`, [name, lastname, username, password]);
                break;
            default:
                throw new Error('Invalid role specified');
        }
        
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
}

// Function to find a user by username and role
export async function findUserByUsernameAndRole(username, role) {
    switch (role) {
        case 'doctor':
            try {
                const [rows] = await pool.query('SELECT * FROM doctor WHERE username = ?', [username]);
        
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error finding doctor by username:', error);
                throw error; 
            }
            
        case 'patient':
            try {
                const [rows] = await pool.query('SELECT * FROM patient WHERE username = ?', [username]);
        
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null; 
                }
            } catch (error) {
                console.error('Error finding patient by username:', error);
                throw error; 
            }
        case 'insurance':
            try {
                const [rows] = await pool.query('SELECT * FROM insurance WHERE username = ?', [username]);
        
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null; 
                }
            } catch (error) {
                console.error('Error finding insurnace by username:', error);
                throw error; 
            }
        case 'pharmacy':
            try {
                const [rows] = await pool.query('SELECT * FROM pharmacy WHERE username = ?', [username]);
        
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return null; 
                }
            } catch (error) {
                console.error('Error finding pharmacy by username:', error);
                throw error; 
            }
        default:
            return null; 
    }
}



