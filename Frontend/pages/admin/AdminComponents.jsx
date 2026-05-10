import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaUserFriends, FaCheck, FaTimes, FaBan, FaEnvelope, FaCamera, FaPen, FaSync } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import UniversalImageCropper from "../../components/UniversalImageCropper";

export const LOGO_URL = "https://res.cloudinary.com/daokrum7i/image/upload/v1768550123/favicon-32x32_kca2tb.png";

export const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-body/40 mb-1">{label}</p>
    <p className="font-bold text-text-body break-words">{value || 'N/A'}</p>
  </div>
);

export const DetailList = ({ label, items }) => {
  const displayItems = Array.isArray(items) ? items : (items ? [items] : []);
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-body/40 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {displayItems.length > 0 ? (
          displayItems.map((item, i) => (
            <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg border border-primary/10 capitalize">
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-text-body/40 italic">None selected</span>
        )}
      </div>
    </div>
  );
};

export const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const IdModal = ({ isOpen, onClose, idImage }) => {
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (window.__lenis) window.__lenis.start();
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (window.__lenis) window.__lenis.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border">
          <h3 className="text-xl font-bold text-primary">Government ID Verification</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg rounded-xl transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        <div 
          className="p-4 bg-[#111] overflow-auto flex justify-center items-center" 
          style={{ maxHeight: '80vh', overscrollBehavior: 'contain' }}
        >
          {idImage ? (
            <img src={idImage} alt="Gov ID" className="max-w-full h-auto shadow-2xl rounded-lg" />
          ) : (
            <div className="py-32 text-white/20 font-bold uppercase tracking-widest">No ID image found</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ViewMoreModal = ({ isOpen, onClose, vol }) => {
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (window.__lenis) window.__lenis.start();
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (window.__lenis) window.__lenis.start();
    };
  }, [isOpen]);

  if (!isOpen || !vol) return null;
  return createPortal(
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="bg-primary px-10 py-8 text-white flex justify-between items-center bg-gradient-to-r from-primary to-blood shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white">
              {vol.profilePicture ? (
                <img src={vol.profilePicture} alt={vol.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/20 bg-bg">
                  <FaUserFriends size={32} />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">{vol.fullName}</h3>
              <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                Volunteer Profile Details
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <FaTimes size={20} />
          </button>
        </div>
        <div 
          className="p-10 overflow-y-auto"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="p-6 bg-bg/50 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Experience & Skills</h4>
                <DetailItem label="Current Occupation" value={vol.occupation === 'Other' ? vol.occupationDetail : vol.occupation} />
                <DetailItem label="Professional Skills" value={vol.skills} />
                <DetailItem label="Location" value={vol.locationAddress} />
              </div>
              <div className="p-6 bg-bg/50 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Verification Information</h4>
                <DetailItem label="Government ID" value={vol.govIdType} />
                <DetailItem label="Blood Group" value={vol.bloodGroup} />
              </div>
            </div>
            <div className="space-y-8">
              <div className="p-6 bg-bg/50 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Engagement Preferences</h4>
                <DetailList label="Time Commitment" items={vol.timeCommitment} />
                <DetailList label="Preferred Working Mode" items={vol.workingMode} />
                <DetailList label="Role Preferences" items={vol.rolePreference} />
              </div>
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Motivation / Interest</h4>
                <p className="text-sm font-bold text-text-body italic">"{vol.interest}"</p>
                <div className="mt-4">
                  <DetailList label="Donation Support" items={vol.deviceDonationChoices} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};



export const VolunteerEditModal = ({ isOpen, onClose, volunteer, onUpdate }) => {
  const [formData, setFormData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Crop states
  const [cropImage, setCropImage] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile' or 'govId'

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (window.__lenis) window.__lenis.start();
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (window.__lenis) window.__lenis.start();
    };
  }, [isOpen]);

  useEffect(() => {
    if (volunteer) {
      setFormData({ ...volunteer });
    }
  }, [volunteer, isOpen]);

  if (!isOpen || !formData) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox" && Array.isArray(formData[name])) {
      const currentArray = [...formData[name]];
      if (checked) {
        currentArray.push(value);
      } else {
        const index = currentArray.indexOf(value);
        if (index > -1) currentArray.splice(index, 1);
      }
      setFormData((prev) => ({ ...prev, [name]: currentArray }));
      return;
    }

    if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result);
      setCropType(type);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropDone = async (croppedFile) => {
    setIsUploading(true);
    try {
      const token = sessionStorage.getItem("adminToken") || sessionStorage.getItem("token");
      const uploadData = new FormData();
      uploadData.append("image", croppedFile);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/volunteers/upload`,
        uploadData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );

      const imageUrl = response.data.imageUrl;
      setFormData(prev => ({
        ...prev,
        [cropType === 'profile' ? 'profilePicture' : 'govIdImage']: imageUrl
      }));
      toast.success(`${cropType === 'profile' ? 'Profile' : 'ID'} image uploaded`);
    } catch (err) {
      toast.error("Image upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
      setCropImage(null);
      setCropType(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      const token = sessionStorage.getItem("adminToken") || sessionStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/volunteers/${formData._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Volunteer details updated");
      onUpdate();
      onClose();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const inputClasses = "w-full px-5 py-3 border border-border rounded-xl focus:border-primary outline-none transition-all shadow-sm";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-text-body/40 mb-1 block";

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const govIdOptions = ["Aadhar Card", "Voter ID", "PAN Card", "Passport", "Other"];
  const interests = [
    "Community & Field Engagement", "Education & Skill Development", "Health & Well-being",
    "Environment & Sustainability", "Creative & Media Support", "Administration & Management",
    "Fundraising & Partnerships", "Blood Donation", "Poor/Needy Support", "Animal Rescue", "Event Organizing"
  ];
  const occupations = [
    "Student (School / College)", "Working Professional", "Business Owner / Entrepreneur",
    "Homemaker", "Retired Professional", "Freelancer", "Government Employee",
    "NGO / Social Sector Professional", "Medical Professional", "Legal Professional",
    "Educator / Teacher", "IT Professional", "Other"
  ];
  const timeCommitments = ["One-time Event", "Weekend Volunteer", "Monthly Commitment", "Project-Based", "Long-Term Association"];
  const workingModes = ["On-ground (Field Work)", "Remote / Online", "Hybrid"];
  const rolePreferences = ["Team Member", "Team Leader", "Coordinator", "Consultant / Advisor", "Intern"];

  return (
    <>
      {createPortal(
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          onWheel={(e) => e.stopPropagation()}
        >
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="bg-primary px-8 py-6 text-white flex justify-between items-center shrink-0">
            <h3 className="text-xl font-black uppercase tracking-widest">Edit Volunteer Profile</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><FaTimes size={20} /></button>
          </div>
          
          {/* Form Content */}
          <div 
            className="flex-1 overflow-y-auto p-8"
            style={{ overscrollBehavior: 'contain' }}
          >
            <form id="edit-volunteer-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Image Section */}
              <div className="flex flex-col md:flex-row gap-12 items-center md:items-start border-b border-border pb-8">
                <div className="space-y-3 text-center">
                  <label className={labelClasses}>Profile Picture</label>
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-primary/10 shadow-xl bg-bg">
                      {isUploading && cropType === 'profile' ? (
                        <div className="w-full h-full flex items-center justify-center bg-bg"><FaSync className="animate-spin text-primary" size={24} /></div>
                      ) : formData.profilePicture ? (
                        <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20"><FaUserFriends size={48} /></div>
                      )}
                    </div>
                    <input type="file" id="edit-profile-pic" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} />
                    <label htmlFor="edit-profile-pic" className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-all">
                      <FaCamera size={16} />
                    </label>
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <label className={labelClasses}>Government ID Image</label>
                  <div className="relative group w-full">
                    <div className="w-full h-40 rounded-3xl overflow-hidden border-2 border-dashed border-primary/20 bg-bg flex items-center justify-center">
                      {isUploading && cropType === 'govId' ? (
                        <FaSync className="animate-spin text-primary" size={32} />
                      ) : formData.govIdImage ? (
                        <img src={formData.govIdImage} alt="Gov ID" className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-text-body/20 font-bold uppercase tracking-widest text-xs">No ID Image</span>
                      )}
                    </div>
                    <input type="file" id="edit-gov-id" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'govId')} />
                    <label htmlFor="edit-gov-id" className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-xl shadow-xl cursor-pointer hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold">
                      <FaPen size={12} /> Replace ID Image
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Full Name</label>
                  <input required name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Email (Read Only)</label>
                  <input readOnly type="email" value={formData.email} className={`${inputClasses} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Phone Number</label>
                  <input required name="phone" type="text" value={formData.phone} onChange={handleChange} className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Emergency Contact</label>
                  <input required name="emergencyContact" type="text" value={formData.emergencyContact} onChange={handleChange} className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Date of Birth</label>
                  <input required name="dob" type="date" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={handleChange} className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Joining Date</label>
                  <input required name="joiningDate" type="date" value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ''} onChange={handleChange} className={inputClasses} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClasses}>
                    <option value="">Select BG</option>
                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Area of Interest</label>
                  <select name="interest" value={formData.interest} onChange={handleChange} className={inputClasses}>
                    <option value="">Select Interest</option>
                    {interests.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Occupation</label>
                  <select name="occupation" value={formData.occupation} onChange={handleChange} className={inputClasses}>
                    <option value="">Select Occupation</option>
                    {occupations.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                {formData.occupation === 'Other' && (
                  <div className="space-y-1">
                    <label className={labelClasses}>Specify Occupation</label>
                    <input name="occupationDetail" type="text" value={formData.occupationDetail} onChange={handleChange} className={inputClasses} />
                  </div>
                )}
                <div className="space-y-1">
                  <label className={labelClasses}>Government ID Type</label>
                  <select name="govIdType" value={formData.govIdType} onChange={handleChange} className={inputClasses}>
                    {govIdOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Skills</label>
                  <textarea name="skills" rows="3" value={formData.skills} onChange={handleChange} className={`${inputClasses} resize-none`} />
                </div>
                
                <div className="space-y-3">
                  <label className={labelClasses}>Time Commitment</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeCommitments.map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-bg cursor-pointer transition-all">
                        <input type="radio" name="timeCommitment" value={opt} checked={formData.timeCommitment === opt} onChange={handleChange} className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-text-body/70">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={labelClasses}>Preferred Working Mode</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {workingModes.map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-bg cursor-pointer transition-all">
                        <input type="radio" name="workingMode" value={opt} checked={formData.workingMode === opt} onChange={handleChange} className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-text-body/70">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={labelClasses}>Role Preference</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {rolePreferences.map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-bg cursor-pointer transition-all">
                        <input type="radio" name="rolePreference" value={opt} checked={formData.rolePreference === opt} onChange={handleChange} className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-text-body/70">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={labelClasses}>Optional Donation Support</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["T-Shirts", "Gadgets", "Laptops", "Phones"].map(opt => (
                      <label key={opt} className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-bg cursor-pointer transition-all">
                        <input type="checkbox" name="deviceDonationChoices" value={opt} checked={formData.deviceDonationChoices?.includes(opt)} onChange={handleChange} className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-text-body/70">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-border bg-gray-50/50 shrink-0 flex gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 border border-border rounded-2xl font-bold bg-white hover:bg-bg transition-all text-sm"
            >
              Cancel Changes
            </button>
            <button 
              type="submit" 
              form="edit-volunteer-form"
              disabled={isUpdating || isUploading} 
              className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2"
            >
              {isUpdating ? <><FaSync className="animate-spin" /> Updating...</> : "Save Profile Details"}
            </button>
          </div>
        </div>
      </div>,
        document.body
      )}

      {cropImage && (
        <UniversalImageCropper
          imageSrc={cropImage}
          onCropDone={handleCropDone}
          onCancel={() => { setCropImage(null); setCropType(null); }}
          aspect={cropType === 'profile' ? 1 : undefined}
          cropShape={cropType === 'profile' ? 'round' : 'rect'}
          title={`Crop ${cropType === 'profile' ? 'Profile' : 'Gov ID'} Photo`}
        />
      )}
    </>
  );
};

