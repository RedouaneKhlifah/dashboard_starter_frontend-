const getDotenv = (key: string): string => {
    const value = process.env[key];
    if (value === undefined || value === null) {
        console.log("");
        console.log(
            "---------------- Environment variable undefined or null -------------------"
        );

        console.log(`Environment variable "${key}" is undefined or null`);
        console.log("");
        
        throw new Error(`Environment variable "${key}" is undefined or null`);
                
    }
    return value;
};

export default getDotenv;