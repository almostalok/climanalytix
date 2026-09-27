import { Region } from '../types/geo';

export const REGIONS: Region[] = [
  // Country
  { id: 'ind', name: 'India', type: 'country', parentId: null, centroid: [20.5937, 78.9629] },

  // States
  { id: 'up', name: 'Uttar Pradesh', type: 'state', parentId: 'ind', centroid: [26.8467, 80.9462] },
  { id: 'dl', name: 'Delhi (NCT)', type: 'state', parentId: 'ind', centroid: [28.6139, 77.209] },
  { id: 'rj', name: 'Rajasthan', type: 'state', parentId: 'ind', centroid: [27.0238, 74.2179] },
  { id: 'mh', name: 'Maharashtra', type: 'state', parentId: 'ind', centroid: [19.7515, 75.7139] },
  { id: 'ka', name: 'Karnataka', type: 'state', parentId: 'ind', centroid: [15.3173, 75.7139] },
  { id: 'tn', name: 'Tamil Nadu', type: 'state', parentId: 'ind', centroid: [11.1271, 78.6569] },
  { id: 'wb', name: 'West Bengal', type: 'state', parentId: 'ind', centroid: [22.9868, 87.855] },
  { id: 'as', name: 'Assam', type: 'state', parentId: 'ind', centroid: [26.2006, 92.9376] },

  // Districts - Uttar Pradesh
  { id: 'up_gbnagar', name: 'Gautam Buddha Nagar', type: 'district', parentId: 'up', centroid: [28.5355, 77.391] },
  { id: 'up_lucknow', name: 'Lucknow', type: 'district', parentId: 'up', centroid: [26.8467, 80.9462] },
  { id: 'up_varanasi', name: 'Varanasi', type: 'district', parentId: 'up', centroid: [25.3176, 82.9739] },

  // Districts - Delhi
  { id: 'dl_newdelhi', name: 'New Delhi', type: 'district', parentId: 'dl', centroid: [28.6139, 77.209] },
  { id: 'dl_central', name: 'Central Delhi', type: 'district', parentId: 'dl', centroid: [28.6448, 77.2167] },

  // Districts - Rajasthan
  { id: 'rj_jaipur', name: 'Jaipur', type: 'district', parentId: 'rj', centroid: [26.9124, 75.7873] },
  { id: 'rj_jodhpur', name: 'Jodhpur', type: 'district', parentId: 'rj', centroid: [26.2389, 73.0243] },

  // Districts - Maharashtra
  { id: 'mh_pune', name: 'Pune', type: 'district', parentId: 'mh', centroid: [18.5204, 73.8567] },
  { id: 'mh_mumbai', name: 'Mumbai City', type: 'district', parentId: 'mh', centroid: [18.9388, 72.8354] },

  // Districts - Karnataka
  { id: 'ka_bengaluru', name: 'Bengaluru Urban', type: 'district', parentId: 'ka', centroid: [12.9716, 77.5946] },
  { id: 'ka_mysuru', name: 'Mysuru', type: 'district', parentId: 'ka', centroid: [12.2958, 76.6394] },

  // Districts - Tamil Nadu
  { id: 'tn_chennai', name: 'Chennai', type: 'district', parentId: 'tn', centroid: [13.0827, 80.2707] },
  { id: 'tn_coimbatore', name: 'Coimbatore', type: 'district', parentId: 'tn', centroid: [11.0168, 76.9558] },

  // Districts - West Bengal
  { id: 'wb_kolkata', name: 'Kolkata', type: 'district', parentId: 'wb', centroid: [22.5726, 88.3639] },
  { id: 'wb_darjeeling', name: 'Darjeeling', type: 'district', parentId: 'wb', centroid: [27.041, 88.2663] },

  // Districts - Assam
  { id: 'as_kamrup', name: 'Kamrup Metropolitan', type: 'district', parentId: 'as', centroid: [26.1445, 91.7362] },
  { id: 'as_dibrugarh', name: 'Dibrugarh', type: 'district', parentId: 'as', centroid: [27.4728, 94.912] },

  // Blocks / Sub-districts
  // UP - Gautam Buddha Nagar
  { id: 'up_gb_dadri', name: 'Dadri', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_gb_noida', name: 'Noida (Sadar)', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_gb_gnoida', name: 'Greater Noida', type: 'block', parentId: 'up_gbnagar' },
  { id: 'up_gb_jewar', name: 'Jewar', type: 'block', parentId: 'up_gbnagar' },

  // UP - Lucknow
  { id: 'up_lk_sarojini', name: 'Sarojini Nagar', type: 'block', parentId: 'up_lucknow' },
  { id: 'up_lk_bakshi', name: 'Bakshi Ka Talab', type: 'block', parentId: 'up_lucknow' },

  // UP - Varanasi
  { id: 'up_var_kashi', name: 'Kashi Vidyapeeth', type: 'block', parentId: 'up_varanasi' },
  { id: 'up_var_pindra', name: 'Pindra', type: 'block', parentId: 'up_varanasi' },

  // Delhi
  { id: 'dl_nd_chanakya', name: 'Chanakyapuri', type: 'block', parentId: 'dl_newdelhi' },
  { id: 'dl_nd_cp', name: 'Connaught Place', type: 'block', parentId: 'dl_newdelhi' },
  { id: 'dl_cn_kotwali', name: 'Kotwali', type: 'block', parentId: 'dl_central' },

  // Rajasthan
  { id: 'rj_jp_amber', name: 'Amber', type: 'block', parentId: 'rj_jaipur' },
  { id: 'rj_jp_sanganer', name: 'Sanganer', type: 'block', parentId: 'rj_jaipur' },
  { id: 'rj_jd_luni', name: 'Luni', type: 'block', parentId: 'rj_jodhpur' },

  // Maharashtra
  { id: 'mh_pn_haveli', name: 'Haveli', type: 'block', parentId: 'mh_pune' },
  { id: 'mh_pn_mulshi', name: 'Mulshi', type: 'block', parentId: 'mh_pune' },
  { id: 'mh_pn_baramati', name: 'Baramati', type: 'block', parentId: 'mh_pune' },
  { id: 'mh_mb_colaba', name: 'Colaba', type: 'block', parentId: 'mh_mumbai' },

  // Karnataka
  { id: 'ka_bg_north', name: 'Bangalore North', type: 'block', parentId: 'ka_bengaluru' },
  { id: 'ka_bg_south', name: 'Bangalore South', type: 'block', parentId: 'ka_bengaluru' },
  { id: 'ka_bg_anekal', name: 'Anekal', type: 'block', parentId: 'ka_bengaluru' },
  { id: 'ka_my_nanjangud', name: 'Nanjangud', type: 'block', parentId: 'ka_mysuru' },

  // Tamil Nadu
  { id: 'tn_ch_egmore', name: 'Egmore', type: 'block', parentId: 'tn_chennai' },
  { id: 'tn_ch_mylapore', name: 'Mylapore', type: 'block', parentId: 'tn_chennai' },
  { id: 'tn_cb_pollachi', name: 'Pollachi', type: 'block', parentId: 'tn_coimbatore' },

  // West Bengal
  { id: 'wb_kl_alipore', name: 'Alipore', type: 'block', parentId: 'wb_kolkata' },
  { id: 'wb_kl_sealdah', name: 'Sealdah', type: 'block', parentId: 'wb_kolkata' },
  { id: 'wb_dj_kurseong', name: 'Kurseong', type: 'block', parentId: 'wb_darjeeling' },

  // Assam
  { id: 'as_km_dispur', name: 'Dispur', type: 'block', parentId: 'as_kamrup' },
  { id: 'as_km_sadar', name: 'Guwahati Sadar', type: 'block', parentId: 'as_kamrup' },
  { id: 'as_db_moran', name: 'Moran', type: 'block', parentId: 'as_dibrugarh' },
];
