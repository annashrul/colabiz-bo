import IndexMember from "./components/App/masterdata/member/index";
import IndexStokis from "./components/App/masterdata/stokis/index";
import IndexUser from "./components/App/masterdata/pengguna/index";
import IndexUserLevel from "./components/App/masterdata/pengguna/level";
import IndexPaketRegister from "./components/App/masterdata/paket/register";
import IndexPaketSmartContract from "./components/App/masterdata/paket/smartContract";
import IndexPaketHappyShopping from "./components/App/masterdata/paket/happyShopping";
import IndexKategoriPaket from "./components/App/masterdata/paket/kategori";
import IndexTipePaket from "./components/App/masterdata/paket/tipe";
import IndexBerita from "./components/App/masterdata/berita/indexBerita";
import IndexKategoriBerita from "./components/App/masterdata/berita/kategoriBerita";
import IndexTestimoni from "./components/App/masterdata/testimoni/index";
import IndexDeposit from "./components/App/ewallet/indexDeposit";
import IndexPenarikan from "./components/App/ewallet/indexPenarikan";
import IndexLaporanPenjualan from "./components/App/laporan/transaksi/penjualan";
import IndexLaporanMember from "./components/App/laporan/transaksi/member";
import IndexPengaturaBank from "./components/App/setting/bank";
import IndexPengaturanUmum from "./components/App/setting/umum";
import IndexPengaturanAlokasi from "./components/App/setting/alokasi";
// import IndexPengaturanLanding from "./components/App/setting/website";

export const LinkMenu = {
  dashboard: "/",
  indexMember: "/masterdata/member",
  indexStokis: "/masterdata/stokis",
  indexUser: "/masterdata/pengguna",
  indexUserLevel: "/masterdata/pengguna/akses",
  indexPaketRegister: "/masterdata/paket/register",
  indexPaketSmartContract: "/masterdata/paket/smart-contract",
  indexPaketHappyShopping: "/masterdata/paket/happy-shopping",
  indexKategoriPaket: "/masterdata/paket/kategori",
  indexTipePaket: "/masterdata/paket/tipe",
  indexBerita: "/masterdata/berita",
  indexKategoriBerita: "/masterdata/berita/kategori",
  indexTestimoni: "/masterdata/testimoni",
  indexDeposit: "/ewallet/deposit",
  indexPenarikan: "/ewallet/penarikan",
  indexLaporanMember: "/laporan/transaksi/member",
  indexLaporanPenjualan: "/laporan/transaksi/penjualan",
  indexPengaturanUmum: "/pengatura/umum",
  indexPengaturanBank: "/pengaturan/bank",
  indexPengaturanKurir: "/pengaturan/kurir",
  indexPengaturanLanding: "/pengaturan/landing",
  indexPengaturanAlokasi: "/pengaturan/alokasi",
};

export const menuItem = [
  { link: LinkMenu.indexMember, component: IndexMember },
  { link: LinkMenu.indexStokis, component: IndexStokis },
  { link: LinkMenu.indexUser, component: IndexUser },
  { link: LinkMenu.indexUserLevel, component: IndexUserLevel },
  { link: LinkMenu.indexPaketRegister, component: IndexPaketRegister },
  {
    link: LinkMenu.indexPaketSmartContract,
    component: IndexPaketSmartContract,
  },
  {
    link: LinkMenu.indexPaketHappyShopping,
    component: IndexPaketHappyShopping,
  },
  { link: LinkMenu.indexKategoriPaket, component: IndexKategoriPaket },
  { link: LinkMenu.indexTipePaket, component: IndexTipePaket },
  { link: LinkMenu.indexBerita, component: IndexBerita },
  { link: LinkMenu.indexKategoriBerita, component: IndexKategoriBerita },
  { link: LinkMenu.indexTestimoni, component: IndexTestimoni },
  { link: LinkMenu.indexDeposit, component: IndexDeposit },
  { link: LinkMenu.indexPenarikan, component: IndexPenarikan },
  { link: LinkMenu.indexLaporanMember, component: IndexLaporanMember },
  { link: LinkMenu.indexLaporanPenjualan, component: IndexLaporanPenjualan },
  { link: LinkMenu.indexPengaturanUmum, component: IndexPengaturanUmum },
  { link: LinkMenu.indexPengaturanBank, component: IndexPengaturaBank },
  { link: LinkMenu.indexPengaturanAlokasi, component: IndexPengaturanAlokasi },
  // { link: LinkMenu.indexPengaturanKurir, component: IndexPengaturanKurir },
  // { link: LinkMenu.indexPengaturanLanding, component: IndexPengaturanLanding },
];

export const menu = () => {
  return [
    {
      id: 0,
      label: "member",
      path: LinkMenu.indexMember,
      isChecked: false,
      isToggle: false,
      sub: undefined,
      icons: "fa fa-user-o",
    },
    {
      id: 2000,
      label: "stokis",
      path: LinkMenu.indexStokis,
      isChecked: false,
      isToggle: false,
      sub: undefined,
      icons: "fa fa-diamond",
    },
    {
      id: 3000,
      label: "testimoni",
      path: LinkMenu.indexTestimoni,
      isChecked: false,
      isToggle: false,
      sub: undefined,
      icons: "fa fa-star-o",
    },

    {
      id: 20,
      label: "pengguna",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-users",
      sub: [
        {
          id: 21,
          label: "list",
          path: LinkMenu.indexUser,
          parent: "pengguna",
          isChecked: false,
        },
        {
          id: 22,
          label: "akses",
          path: LinkMenu.indexUserLevel,
          parent: "pengguna",
          isChecked: false,
        },
      ],
    },
    {
      id: 1000,
      label: "paket",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-list",
      sub: [
        {
          id: 1001,
          label: "register",
          path: LinkMenu.indexPaketRegister,
          parent: "paket",
          isChecked: false,
        },
        {
          id: 1002,
          label: "smart-contract",
          path: LinkMenu.indexPaketSmartContract,
          parent: "paket",
          isChecked: false,
        },
        {
          id: 1003,
          label: "happy-shopping",
          path: LinkMenu.indexPaketHappyShopping,
          parent: "paket",
          isChecked: false,
        },
      ],
    },

    {
      id: 10,
      label: "e-wallet",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-credit-card",
      sub: [
        {
          id: 11,
          label: "deposit",
          path: LinkMenu.indexDeposit,
          parent: "e-wallet",
          isChecked: false,
        },
        {
          id: 12,
          label: "penarikan",
          path: LinkMenu.indexPenarikan,
          parent: "e-wallet",
          isChecked: false,
        },
      ],
    },

    {
      id: 350,
      label: "berita",
      path: "",
      isChecked: false,
      icons: "fa fa-newspaper-o",
      sub: [
        {
          id: 351,
          label: "list",
          path: LinkMenu.indexBerita,
          parent: "berita",
          isChecked: false,
          sub: undefined,
        },
        {
          id: 352,
          label: "kategori",
          path: LinkMenu.indexKategoriBerita,
          parent: "berita",
          isChecked: false,
          sub: undefined,
        },
      ],
    },
    {
      id: 400,
      label: "laporan",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-book",
      sub: [
        {
          id: 401,
          label: "member",
          path: LinkMenu.indexLaporanMember,
          parent: "laporan",
          isChecked: false,
        },
      ],
      otherSub: true,
    },
    {
      id: 15,
      label: "pengaturan",
      path: "",
      isChecked: false,
      isToggle: false,
      icons: "fa fa-cogs",
      sub: [
        {
          id: 16,
          label: "alokasi",
          path: LinkMenu.indexPengaturanAlokasi,
          parent: "pengaturan",
          isChecked: false,
        },
        {
          id: 17,
          label: "bank",
          path: LinkMenu.indexPengaturanBank,
          parent: "pengaturan",
          isChecked: false,
        },
      ],
      otherSub: true,
    },
  ];
};
