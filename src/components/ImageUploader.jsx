import React, { useState } from 'react';
import { uploadImage, getImageUrl } from '../api';

const ImageUploader = ({ value, onChange, placeholder = "Image URL" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            const res = await uploadImage(file);
            onChange(res.url);
        } catch (err) {
            console.error("Upload failed", err);
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    className="w-full p-2 border rounded dark:bg-neutral-900 dark:text-white"
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <button className={`px-4 py-2 rounded font-bold text-white whitespace-nowrap ${uploading ? 'bg-gray-400' : 'bg-secondary hover:bg-secondary-dark'}`}>
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {value && (
                <div className="mt-2 w-full h-32 bg-gray-100 dark:bg-neutral-900 rounded-lg overflow-hidden border dark:border-neutral-700 relative">
                    <img src={getImageUrl(value)} alt="Preview" className="w-full h-full object-contain" />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
