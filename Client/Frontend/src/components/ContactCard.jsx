import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import profile from '../Images/profile.png'; // Assuming this exists from previous structure

const ContactCard = ({ contact, onEdit, onDelete }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
        >
            {/* Actions - Visible on hover */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(contact)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                    title="Edit"
                >
                    <FiEdit2 size={18} />
                </button>
                <button
                    onClick={() => onDelete(contact)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Delete"
                >
                    <FiTrash2 size={18} />
                </button>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-800 p-1">
                            <img
                                src={profile}
                                alt={contact.firstName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                <h3 className="mt-4 text-lg font-bold text-white tracking-tight">
                    {contact.firstName} {contact.lastName}
                </h3>

                <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center text-slate-300 bg-slate-900/50 p-3 rounded-xl">
                        <FiMail className="w-5 h-5 text-indigo-400 mr-3" />
                        <span className="text-sm truncate">{contact.email}</span>
                    </div>

                    <div className="flex items-center text-slate-300 bg-slate-900/50 p-3 rounded-xl">
                        <FiPhone className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-sm">{contact.code} {contact.phoneNumber}</span>
                    </div>

                    <div className="flex items-center justify-center text-slate-500 text-xs mt-2">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        Created: {contact.createDate}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactCard;
