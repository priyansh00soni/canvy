
import connectDB from './config/db.js';
import { app } from './app.js';

const PORT=process.env.PORT

try {
    connectDB()
} catch (error) {
    console.log(`DB Connection Error:`,error);
}

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});