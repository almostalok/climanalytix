import { Region } from '../types/geo';

export const REGIONS: Region[] = [
  // Country
  { id: 'ind', name: 'India', type: 'country', parentId: null, centroid: [22.5, 79.5] },

  // ==================== STATES ====================
  { id: 'up', name: 'Uttar Pradesh', type: 'state', parentId: 'ind', centroid: [26.8467, 80.9462] },
  { id: 'mh', name: 'Maharashtra', type: 'state', parentId: 'ind', centroid: [19.7515, 75.7139] },
  { id: 'mp', name: 'Madhya Pradesh', type: 'state', parentId: 'ind', centroid: [23.2599, 77.4126] },
  { id: 'rj', name: 'Rajasthan', type: 'state', parentId: 'ind', centroid: [27.0238, 74.2179] },
  { id: 'gj', name: 'Gujarat', type: 'state', parentId: 'ind', centroid: [22.2587, 71.1924] },
  { id: 'ka', name: 'Karnataka', type: 'state', parentId: 'ind', centroid: [15.3173, 75.7139] },
  { id: 'pb', name: 'Punjab', type: 'state', parentId: 'ind', centroid: [31.1471, 75.3412] },
  { id: 'hr', name: 'Haryana', type: 'state', parentId: 'ind', centroid: [29.0588, 76.0856] },
  { id: 'tn', name: 'Tamil Nadu', type: 'state', parentId: 'ind', centroid: [11.1271, 78.6569] },
  { id: 'ap', name: 'Andhra Pradesh', type: 'state', parentId: 'ind', centroid: [15.9129, 79.74] },
  { id: 'tg', name: 'Telangana', type: 'state', parentId: 'ind', centroid: [18.1124, 79.0193] },
  { id: 'wb', name: 'West Bengal', type: 'state', parentId: 'ind', centroid: [22.9868, 87.855] },
  { id: 'br', name: 'Bihar', type: 'state', parentId: 'ind', centroid: [25.0961, 85.3131] },
  { id: 'od', name: 'Odisha', type: 'state', parentId: 'ind', centroid: [20.9517, 85.0985] },
  { id: 'kl', name: 'Kerala', type: 'state', parentId: 'ind', centroid: [10.8505, 76.2711] },
  { id: 'as', name: 'Assam', type: 'state', parentId: 'ind', centroid: [26.2006, 92.9376] },
  { id: 'cg', name: 'Chhattisgarh', type: 'state', parentId: 'ind', centroid: [21.2787, 81.8661] },
  { id: 'jh', name: 'Jharkhand', type: 'state', parentId: 'ind', centroid: [23.6102, 85.2799] },
  { id: 'uk', name: 'Uttarakhand', type: 'state', parentId: 'ind', centroid: [30.0668, 79.0193] },
  { id: 'hp', name: 'Himachal Pradesh', type: 'state', parentId: 'ind', centroid: [31.1048, 77.1734] },
  { id: 'dl', name: 'Delhi (NCT)', type: 'state', parentId: 'ind', centroid: [28.6139, 77.209] },
  { id: 'jk', name: 'Jammu & Kashmir', type: 'state', parentId: 'ind', centroid: [33.7782, 76.5762] },

  // ==================== DISTRICTS ====================
  // Uttar Pradesh
  { id: 'up_gbnagar', name: 'Gautam Buddha Nagar', type: 'district', parentId: 'up', centroid: [28.5355, 77.391] },
  { id: 'up_lucknow', name: 'Lucknow', type: 'district', parentId: 'up', centroid: [26.8467, 80.9462] },
  { id: 'up_varanasi', name: 'Varanasi', type: 'district', parentId: 'up', centroid: [25.3176, 82.9739] },
  { id: 'up_prayagraj', name: 'Prayagraj (Allahabad)', type: 'district', parentId: 'up', centroid: [25.4358, 81.8463] },
  { id: 'up_agra', name: 'Agra', type: 'district', parentId: 'up', centroid: [27.1767, 78.0081] },
  { id: 'up_kanpur', name: 'Kanpur Nagar', type: 'district', parentId: 'up', centroid: [26.4499, 80.3319] },
  { id: 'up_gorakhpur', name: 'Gorakhpur', type: 'district', parentId: 'up', centroid: [26.7606, 83.3732] },
  { id: 'up_bareilly', name: 'Bareilly', type: 'district', parentId: 'up', centroid: [28.367, 79.4304] },

  // Maharashtra
  { id: 'mh_pune', name: 'Pune', type: 'district', parentId: 'mh', centroid: [18.5204, 73.8567] },
  { id: 'mh_mumbai', name: 'Mumbai City', type: 'district', parentId: 'mh', centroid: [18.9388, 72.8354] },
  { id: 'mh_nagpur', name: 'Nagpur', type: 'district', parentId: 'mh', centroid: [21.1458, 79.0882] },
  { id: 'mh_nashik', name: 'Nashik', type: 'district', parentId: 'mh', centroid: [19.9975, 73.7898] },
  { id: 'mh_aurangabad', name: 'Chhatrapati Sambhaji Nagar', type: 'district', parentId: 'mh', centroid: [19.8762, 75.3433] },
  { id: 'mh_solapur', name: 'Solapur', type: 'district', parentId: 'mh', centroid: [17.6599, 75.9064] },
  { id: 'mh_amravati', name: 'Amravati', type: 'district', parentId: 'mh', centroid: [20.932, 77.7523] },
  { id: 'mh_kolhapur', name: 'Kolhapur', type: 'district', parentId: 'mh', centroid: [16.705, 74.2433] },

  // Madhya Pradesh
  { id: 'mp_bhopal', name: 'Bhopal', type: 'district', parentId: 'mp', centroid: [23.2599, 77.4126] },
  { id: 'mp_indore', name: 'Indore', type: 'district', parentId: 'mp', centroid: [22.7196, 75.8577] },
  { id: 'mp_jabalpur', name: 'Jabalpur', type: 'district', parentId: 'mp', centroid: [23.1815, 79.9864] },
  { id: 'mp_gwalior', name: 'Gwalior', type: 'district', parentId: 'mp', centroid: [26.2183, 78.1828] },
  { id: 'mp_ujjain', name: 'Ujjain', type: 'district', parentId: 'mp', centroid: [23.1765, 75.7885] },
  { id: 'mp_sagar', name: 'Sagar', type: 'district', parentId: 'mp', centroid: [23.8388, 78.7378] },

  // Rajasthan
  { id: 'rj_jaipur', name: 'Jaipur', type: 'district', parentId: 'rj', centroid: [26.9124, 75.7873] },
  { id: 'rj_jodhpur', name: 'Jodhpur', type: 'district', parentId: 'rj', centroid: [26.2389, 73.0243] },
  { id: 'rj_udaipur', name: 'Udaipur', type: 'district', parentId: 'rj', centroid: [24.5854, 73.7125] },
  { id: 'rj_kota', name: 'Kota', type: 'district', parentId: 'rj', centroid: [25.2138, 75.8648] },
  { id: 'rj_bikaner', name: 'Bikaner', type: 'district', parentId: 'rj', centroid: [28.0229, 73.3119] },
  { id: 'rj_ajmer', name: 'Ajmer', type: 'district', parentId: 'rj', centroid: [26.4499, 74.6399] },

  // Gujarat
  { id: 'gj_ahmedabad', name: 'Ahmedabad', type: 'district', parentId: 'gj', centroid: [23.0225, 72.5714] },
  { id: 'gj_surat', name: 'Surat', type: 'district', parentId: 'gj', centroid: [21.1702, 72.8311] },
  { id: 'gj_vadodara', name: 'Vadodara', type: 'district', parentId: 'gj', centroid: [22.3072, 73.1812] },
  { id: 'gj_rajkot', name: 'Rajkot', type: 'district', parentId: 'gj', centroid: [22.3039, 70.8022] },
  { id: 'gj_bhavnagar', name: 'Bhavnagar', type: 'district', parentId: 'gj', centroid: [21.7645, 72.1519] },

  // Karnataka
  { id: 'ka_bengaluru', name: 'Bengaluru Urban', type: 'district', parentId: 'ka', centroid: [12.9716, 77.5946] },
  { id: 'ka_mysuru', name: 'Mysuru', type: 'district', parentId: 'ka', centroid: [12.2958, 76.6394] },
  { id: 'ka_belagavi', name: 'Belagavi', type: 'district', parentId: 'ka', centroid: [15.8497, 74.4977] },
  { id: 'ka_dharwad', name: 'Hubballi-Dharwad', type: 'district', parentId: 'ka', centroid: [15.3647, 75.124] },
  { id: 'ka_kalaburagi', name: 'Kalaburagi', type: 'district', parentId: 'ka', centroid: [17.3297, 76.8343] },

  // Punjab
  { id: 'pb_ludhiana', name: 'Ludhiana', type: 'district', parentId: 'pb', centroid: [30.901, 75.8573] },
  { id: 'pb_amritsar', name: 'Amritsar', type: 'district', parentId: 'pb', centroid: [31.634, 74.8723] },
  { id: 'pb_jalandhar', name: 'Jalandhar', type: 'district', parentId: 'pb', centroid: [31.326, 75.5762] },
  { id: 'pb_patiala', name: 'Patiala', type: 'district', parentId: 'pb', centroid: [30.3398, 76.3869] },
  { id: 'pb_bathinda', name: 'Bathinda', type: 'district', parentId: 'pb', centroid: [30.211, 74.9455] },

  // Haryana
  { id: 'hr_gurugram', name: 'Gurugram', type: 'district', parentId: 'hr', centroid: [28.4595, 77.0266] },
  { id: 'hr_faridabad', name: 'Faridabad', type: 'district', parentId: 'hr', centroid: [28.4089, 77.3178] },
  { id: 'hr_karnal', name: 'Karnal', type: 'district', parentId: 'hr', centroid: [29.6857, 76.9905] },
  { id: 'hr_hisar', name: 'Hisar', type: 'district', parentId: 'hr', centroid: [29.1492, 75.7217] },
  { id: 'hr_ambala', name: 'Ambala', type: 'district', parentId: 'hr', centroid: [30.3782, 76.7767] },

  // Tamil Nadu
  { id: 'tn_chennai', name: 'Chennai', type: 'district', parentId: 'tn', centroid: [13.0827, 80.2707] },
  { id: 'tn_coimbatore', name: 'Coimbatore', type: 'district', parentId: 'tn', centroid: [11.0168, 76.9558] },
  { id: 'tn_madurai', name: 'Madurai', type: 'district', parentId: 'tn', centroid: [9.9252, 78.1198] },
  { id: 'tn_trichy', name: 'Tiruchirappalli', type: 'district', parentId: 'tn', centroid: [10.7905, 78.7047] },
  { id: 'tn_salem', name: 'Salem', type: 'district', parentId: 'tn', centroid: [11.6643, 78.146] },

  // Andhra Pradesh
  { id: 'ap_visakhapatnam', name: 'Visakhapatnam', type: 'district', parentId: 'ap', centroid: [17.6868, 83.2185] },
  { id: 'ap_vijayawada', name: 'NTR / Vijayawada', type: 'district', parentId: 'ap', centroid: [16.5062, 80.648] },
  { id: 'ap_guntur', name: 'Guntur', type: 'district', parentId: 'ap', centroid: [16.3067, 80.4365] },
  { id: 'ap_tirupati', name: 'Tirupati', type: 'district', parentId: 'ap', centroid: [13.6288, 79.4192] },

  // Telangana
  { id: 'tg_hyderabad', name: 'Hyderabad', type: 'district', parentId: 'tg', centroid: [17.385, 78.4867] },
  { id: 'tg_warangal', name: 'Warangal', type: 'district', parentId: 'tg', centroid: [17.9689, 79.5941] },
  { id: 'tg_nizamabad', name: 'Nizamabad', type: 'district', parentId: 'tg', centroid: [18.6725, 78.0941] },
  { id: 'tg_karimnagar', name: 'Karimnagar', type: 'district', parentId: 'tg', centroid: [18.4386, 79.1288] },

  // West Bengal
  { id: 'wb_kolkata', name: 'Kolkata', type: 'district', parentId: 'wb', centroid: [22.5726, 88.3639] },
  { id: 'wb_darjeeling', name: 'Darjeeling', type: 'district', parentId: 'wb', centroid: [27.041, 88.2663] },
  { id: 'wb_howrah', name: 'Howrah', type: 'district', parentId: 'wb', centroid: [22.5958, 88.2636] },
  { id: 'wb_north24', name: 'North 24 Parganas', type: 'district', parentId: 'wb', centroid: [22.7214, 88.4842] },

  // Bihar
  { id: 'br_patna', name: 'Patna', type: 'district', parentId: 'br', centroid: [25.5941, 85.1376] },
  { id: 'br_gaya', name: 'Gaya', type: 'district', parentId: 'br', centroid: [24.7914, 85.0002] },
  { id: 'br_muzaffarpur', name: 'Muzaffarpur', type: 'district', parentId: 'br', centroid: [26.1209, 85.3647] },
  { id: 'br_bhagalpur', name: 'Bhagalpur', type: 'district', parentId: 'br', centroid: [25.2425, 87.0142] },

  // Odisha
  { id: 'od_bhubaneswar', name: 'Khordha / Bhubaneswar', type: 'district', parentId: 'od', centroid: [20.2961, 85.8245] },
  { id: 'od_cuttack', name: 'Cuttack', type: 'district', parentId: 'od', centroid: [20.4625, 85.8828] },
  { id: 'od_sambalpur', name: 'Sambalpur', type: 'district', parentId: 'od', centroid: [21.4669, 83.9812] },

  // Kerala
  { id: 'kl_tvm', name: 'Thiruvananthapuram', type: 'district', parentId: 'kl', centroid: [8.5241, 76.9366] },
  { id: 'kl_ernakulam', name: 'Ernakulam / Kochi', type: 'district', parentId: 'kl', centroid: [9.9816, 76.2999] },
  { id: 'kl_kozhikode', name: 'Kozhikode', type: 'district', parentId: 'kl', centroid: [11.2588, 75.7804] },

  // Assam
  { id: 'as_kamrup', name: 'Kamrup Metropolitan', type: 'district', parentId: 'as', centroid: [26.1445, 91.7362] },
  { id: 'as_dibrugarh', name: 'Dibrugarh', type: 'district', parentId: 'as', centroid: [27.4728, 94.912] },
  { id: 'as_silchar', name: 'Cachar / Silchar', type: 'district', parentId: 'as', centroid: [24.8333, 92.7789] },

  // Chhattisgarh
  { id: 'cg_raipur', name: 'Raipur', type: 'district', parentId: 'cg', centroid: [21.2514, 81.6296] },
  { id: 'cg_bilaspur', name: 'Bilaspur', type: 'district', parentId: 'cg', centroid: [22.0797, 82.1409] },

  // Jharkhand
  { id: 'jh_ranchi', name: 'Ranchi', type: 'district', parentId: 'jh', centroid: [23.3441, 85.3096] },
  { id: 'jh_jamshedpur', name: 'East Singhbhum / Jamshedpur', type: 'district', parentId: 'jh', centroid: [22.8046, 86.2029] },

  // Uttarakhand
  { id: 'uk_dehradun', name: 'Dehradun', type: 'district', parentId: 'uk', centroid: [30.3165, 78.0322] },
  { id: 'uk_haridwar', name: 'Haridwar', type: 'district', parentId: 'uk', centroid: [29.9457, 78.1642] },

  // Himachal Pradesh
  { id: 'hp_shimla', name: 'Shimla', type: 'district', parentId: 'hp', centroid: [31.1048, 77.1734] },
  { id: 'hp_kangra', name: 'Kangra / Dharamshala', type: 'district', parentId: 'hp', centroid: [32.0998, 76.2691] },

  // Delhi (NCT)
  { id: 'dl_newdelhi', name: 'New Delhi', type: 'district', parentId: 'dl', centroid: [28.6139, 77.209] },
  { id: 'dl_central', name: 'Central Delhi', type: 'district', parentId: 'dl', centroid: [28.6448, 77.2167] },
  { id: 'dl_south', name: 'South Delhi', type: 'district', parentId: 'dl', centroid: [28.5085, 77.1855] },

  // Jammu & Kashmir
  { id: 'jk_srinagar', name: 'Srinagar', type: 'district', parentId: 'jk', centroid: [34.0837, 74.7973] },
  { id: 'jk_jammu', name: 'Jammu', type: 'district', parentId: 'jk', centroid: [32.7266, 74.857] },

  // ==================== BLOCKS / SUB-DISTRICTS ====================
  // UP Blocks
  { id: 'up_gb_dadri', name: 'Dadri', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_gb_noida', name: 'Noida (Sadar)', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_gb_gnoida', name: 'Greater Noida', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_gb_jewar', name: 'Jewar', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_lk_sarojini', name: 'Sarojini Nagar', type: 'block', parentId: 'up_lucknow' },
  { id: 'up_lk_bakshi', name: 'Bakshi Ka Talab', type: 'block', parentId: 'up_lucknow' },
  { id: 'up_var_kashi', name: 'Kashi Vidyapeeth', type: 'block', parentId: 'up_varanasi' },
  { id: 'up_var_pindra', name: 'Pindra', type: 'block', parentId: 'up_varanasi' },
  { id: 'up_pr_sadar', name: 'Sadar Allahabad', type: 'block', parentId: 'up_prayagraj' },
  { id: 'up_pr_phulpur', name: 'Phulpur', type: 'block', parentId: 'up_prayagraj' },
  { id: 'up_ag_fatehabad', name: 'Fatehabad', type: 'block', parentId: 'up_agra' },
  { id: 'up_kn_bilhaur', name: 'Bilhaur', type: 'block', parentId: 'up_kanpur' },

  // MH Blocks
  { id: 'mh_pn_haveli', name: 'Haveli', type: 'block', parentId: 'mh_pune' },
  { id: 'mh_pn_mulshi', name: 'Mulshi', type: 'block', parentId: 'mh_pune' },
  { id: 'mh_pn_baramati', name: 'Baramati', type: 'block', parentId: 'mh_pune' },
  { id: 'mh_mb_colaba', name: 'Colaba', type: 'block', parentId: 'mh_mumbai' },
  { id: 'mh_ng_kamthi', name: 'Kamthi', type: 'block', parentId: 'mh_nagpur' },
  { id: 'mh_ns_dindori', name: 'Dindori', type: 'block', parentId: 'mh_nashik' },
  { id: 'mh_au_paithan', name: 'Paithan', type: 'block', parentId: 'mh_aurangabad' },
  { id: 'mh_so_pandharpur', name: 'Pandharpur', type: 'block', parentId: 'mh_solapur' },

  // MP Blocks
  { id: 'mp_bh_huzur', name: 'Huzur', type: 'block', parentId: 'mp_bhopal' },
  { id: 'mp_in_sanwer', name: 'Sanwer', type: 'block', parentId: 'mp_indore' },
  { id: 'mp_jb_patan', name: 'Patan', type: 'block', parentId: 'mp_jabalpur' },
  { id: 'mp_gw_ghatigaon', name: 'Ghatigaon', type: 'block', parentId: 'mp_gwalior' },

  // RJ Blocks
  { id: 'rj_jp_amber', name: 'Amber', type: 'block', parentId: 'rj_jaipur' },
  { id: 'rj_jp_sanganer', name: 'Sanganer', type: 'block', parentId: 'rj_jaipur' },
  { id: 'rj_jd_luni', name: 'Luni', type: 'block', parentId: 'rj_jodhpur' },
  { id: 'rj_ud_girwa', name: 'Girwa', type: 'block', parentId: 'rj_udaipur' },
  { id: 'rj_kt_ladpura', name: 'Ladpura', type: 'block', parentId: 'rj_kota' },

  // GJ Blocks
  { id: 'gj_ah_sanand', name: 'Sanand', type: 'block', parentId: 'gj_ahmedabad' },
  { id: 'gj_ah_daskroi', name: 'Daskroi', type: 'block', parentId: 'gj_ahmedabad' },
  { id: 'gj_su_chorasi', name: 'Chorasi', type: 'block', parentId: 'gj_surat' },
  { id: 'gj_va_padra', name: 'Padra', type: 'block', parentId: 'gj_vadodara' },

  // KA Blocks
  { id: 'ka_bg_north', name: 'Bangalore North', type: 'block', parentId: 'ka_bengaluru' },
  { id: 'ka_bg_south', name: 'Bangalore South', type: 'block', parentId: 'ka_bengaluru' },
  { id: 'ka_bg_anekal', name: 'Anekal', type: 'block', parentId: 'ka_bengaluru' },
  { id: 'ka_my_nanjangud', name: 'Nanjangud', type: 'block', parentId: 'ka_mysuru' },

  // PB Blocks
  { id: 'pb_ld_khanna', name: 'Khanna', type: 'block', parentId: 'pb_ludhiana' },
  { id: 'pb_am_ajnala', name: 'Ajnala', type: 'block', parentId: 'pb_amritsar' },
  { id: 'pb_jl_nakodar', name: 'Nakodar', type: 'block', parentId: 'pb_jalandhar' },

  // HR Blocks
  { id: 'hr_gg_sohna', name: 'Sohna', type: 'block', parentId: 'hr_gurugram' },
  { id: 'hr_kn_nilokheri', name: 'Nilokheri', type: 'block', parentId: 'hr_karnal' },
  { id: 'hr_hs_hansi', name: 'Hansi', type: 'block', parentId: 'hr_hisar' },

  // TN Blocks
  { id: 'tn_ch_egmore', name: 'Egmore', type: 'block', parentId: 'tn_chennai' },
  { id: 'tn_cb_pollachi', name: 'Pollachi', type: 'block', parentId: 'tn_coimbatore' },
  { id: 'tn_md_melur', name: 'Melur', type: 'block', parentId: 'tn_madurai' },

  // AP & TG Blocks
  { id: 'ap_vj_penamaluru', name: 'Penamaluru', type: 'block', parentId: 'ap_vijayawada' },
  { id: 'tg_hy_secunderabad', name: 'Secunderabad', type: 'block', parentId: 'tg_hyderabad' },
  { id: 'tg_wr_hanamkonda', name: 'Hanamkonda', type: 'block', parentId: 'tg_warangal' },

  // WB & BR & Others Blocks
  { id: 'wb_kl_alipore', name: 'Alipore', type: 'block', parentId: 'wb_kolkata' },
  { id: 'wb_dj_kurseong', name: 'Kurseong', type: 'block', parentId: 'wb_darjeeling' },
  { id: 'br_pt_danapur', name: 'Danapur', type: 'block', parentId: 'br_patna' },
  { id: 'od_bb_jatani', name: 'Jatani', type: 'block', parentId: 'od_bhubaneswar' },
  { id: 'kl_ek_kanayannur', name: 'Kanayannur', type: 'block', parentId: 'kl_ernakulam' },
  { id: 'as_km_dispur', name: 'Dispur', type: 'block', parentId: 'as_kamrup' },
  { id: 'dl_nd_cp', name: 'Connaught Place', type: 'block', parentId: 'dl_newdelhi' },
  { id: 'dl_cn_kotwali', name: 'Kotwali', type: 'block', parentId: 'dl_central' },
  { id: 'jk_sr_khanyar', name: 'Khanyar', type: 'block', parentId: 'jk_srinagar' },
];
