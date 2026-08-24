import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { createMariaDbPoolConfig } from "../src/lib/mariadb-config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(createMariaDbPoolConfig(databaseUrl)),
});

const PHONG_TUC_CATEGORY = {
  slug: "phong-tuc",
  name: "Phong tục",
  description: "Phong tục, tư vấn phong tục nhà ở và văn phòng",
};

const WIKI_CATEGORY_SLUGS = [
  "mua-bat-dong-san",
  "ban-bat-dong-san",
  "thue-bat-dong-san",
  "tai-chinh-bat-dong-san",
  "quy-hoach-phap-ly",
  "noi-ngoai-that",
  "phong-tuc",
];

const ANALYSIS_CATEGORIES = [
  {
    slug: "bieu-do-gia",
    name: "Biểu đồ giá",
    description: "Biểu đồ lịch sử giá bất động sản theo từng địa bàn.",
  },
  {
    slug: "video-danh-gia",
    name: "Video đánh giá",
    description: "Video đánh giá, phân tích thị trường bất động sản từ các chuyên gia.",
  },
  {
    slug: "interkative-story",
    name: "Interkative Story",
    description: "Những câu chuyện tương tác về bất động sản.",
  },
];

const ANALYSIS_CATEGORY_SLUGS = [
  "bieu-do-gia",
  "video-danh-gia",
  "bao-cao-thi-truong",
  "goc-nhin-chuyen-gia",
  "interkative-story",
];

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82",
];

type WikiArticleSeed = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
};

const wikiArticles: Array<{ categorySlug: string; articles: WikiArticleSeed[] }> = [
  {
    categorySlug: "mua-bat-dong-san",
    articles: [
      {
        title: "Kinh nghiệm mua căn hộ chung cư lần đầu không bị lừa",
        slug: "kinh-nghiem-mua-can-ho-chung-cu-lan-dau-khong-bi-lua",
        excerpt: "Tổng hợp những lưu ý quan trọng khi mua căn hộ chung cư lần đầu, từ kiểm tra pháp lý đến thương lượng giá.",
        body: "Trước khi quyết định mua căn hộ chung cư, bạn cần kiểm tra kỹ tính pháp lý của dự án bao gồm giấy phép xây dựng, quy hoạch và hợp đồng mua bán. Việc tham quan thực tế, tìm hiểu chủ đầu tư và so sánh giá khu vực sẽ giúp bạn đưa ra quyết định an toàn hơn.",
      },
      {
        title: "Cách kiểm tra quy hoạch đất trước khi mua nhà",
        slug: "cach-kiem-tra-quy-hoach-dat-truoc-khi-mua-nha",
        excerpt: "Hướng dẫn tra cứu quy hoạch, tránh mua phải nhà đất vướng quy hoạch treo hoặc giải tỏa.",
        body: "Trước khi mua bất kỳ mảnh đất hay căn nhà nào, bạn nên tra cứu thông tin quy hoạch tại phòng tài nguyên môi trường hoặc cổng thông tin quy hoạch trực tuyến của địa phương. Điều này giúp bạn tránh được rủi ro mua phải đất dính quy hoạch treo, giải tỏa hoặc không được phép xây dựng.",
      },
      {
        title: "Bí quyết thương lượng giá nhà đất hiệu quả",
        slug: "bi-quyet-thuong-luong-gia-nha-dat-hieu-qua",
        excerpt: "Chuẩn bị tốt và thương lượng đúng cách giúp bạn mua nhà với mức giá hợp lý nhất.",
        body: "Muốn thương lượng giá thành công, bạn cần nắm rõ mặt bằng giá khu vực, tình trạng pháp lý và những nhược điểm của bất động sản để có căn cứ trả giá. Thái độ lịch sự, kiên nhẫn và sẵn sàng chốt nhanh khi giá hợp lý là những yếu tố giúp bạn đạt thỏa thuận tốt.",
      },
    ],
  },
  {
    categorySlug: "ban-bat-dong-san",
    articles: [
      {
        title: "Chuẩn bị hồ sơ bán nhà đúng quy định",
        slug: "chuan-bi-ho-so-ban-nha-dung-quy-dinh",
        excerpt: "Các giấy tờ cần thiết khi bán nhà để giao dịch nhanh chóng, tránh rủi ro pháp lý.",
        body: "Để bán nhà thuận lợi, bạn cần chuẩn bị đầy đủ sổ đỏ, giấy tờ tùy thân, giấy phép xây dựng và các giấy tờ liên quan khác. Hồ sơ rõ ràng, minh bạch sẽ giúp giao dịch diễn ra nhanh chóng và hạn chế tranh chấp về sau.",
      },
      {
        title: "Định giá nhà đất chuẩn để bán không bị hớ",
        slug: "dinh-gia-nha-dat-chuan-de-ban-khong-bi-ho",
        excerpt: "Cách xác định giá bán hợp lý dựa trên vị trí, diện tích, pháp lý và giá thị trường.",
        body: "Giá bán hợp lý được xác định dựa trên vị trí, diện tích, hiện trạng nhà, pháp lý và mức giá giao dịch thực tế trong khu vực. Tham khảo giá từ nhiều nguồn và nhờ người có kinh nghiệm tư vấn sẽ giúp bạn bán được giá tốt mà không mất nhiều thời gian.",
      },
      {
        title: "Chiến lược đăng tin bán nhà thu hút khách mua",
        slug: "chien-luoc-dang-tin-ban-nha-thu-hut-khach-mua",
        excerpt: "Ảnh đẹp, mô tả rõ ràng và giá hợp lý giúp tin đăng của bạn nhanh chóng tiếp cận khách mua.",
        body: "Một tin đăng hiệu quả cần có ảnh chụp sáng rõ, mô tả chi tiết về diện tích, pháp lý, tiện ích và mức giá minh bạch. Đăng tin lên nhiều kênh, cập nhật thường xuyên và phản hồi nhanh với khách quan tâm sẽ giúp bạn tìm được người mua sớm.",
      },
    ],
  },
  {
    categorySlug: "thue-bat-dong-san",
    articles: [
      {
        title: "Kinh nghiệm thuê nhà trọ an toàn và hợp túi tiền",
        slug: "kinh-nghiem-thue-nha-tro-an-toan-va-hop-tui-tien",
        excerpt: "Lưu ý khi thuê nhà trọ: vị trí, giá, hợp đồng và các khoản phí phát sinh.",
        body: "Khi thuê nhà trọ, bạn nên khảo sát khu vực xung quanh về an ninh, giao thông và tiện ích trước khi quyết định. Đọc kỹ hợp đồng thuê, chốt rõ tiền cọc, tiền điện nước và các khoản phí phát sinh để tránh những bất ngờ không đáng có.",
      },
      {
        title: "Hợp đồng thuê nhà cần có những điều khoản gì",
        slug: "hop-dong-thue-nha-can-co-nhung-dieu-khoan-gi",
        excerpt: "Các điều khoản quan trọng cần lưu ý khi ký hợp đồng thuê nhà để bảo vệ quyền lợi.",
        body: "Một hợp đồng thuê nhà đầy đủ cần nêu rõ thời hạn thuê, mức giá, tiền cọc, phương thức thanh toán và trách nhiệm sửa chữa của hai bên. Ngoài ra, điều khoản về đơn phương chấm dứt hợp đồng và xử lý khi nhà hư hỏng cũng nên được thống nhất ngay từ đầu.",
      },
      {
        title: "Thuê chung cư hay thuê nhà riêng: nên chọn loại nào",
        slug: "thue-chung-cu-hay-thue-nha-rieng-nen-chon-loai-nao",
        excerpt: "So sánh ưu nhược điểm của chung cư và nhà riêng để chọn nơi ở phù hợp nhu cầu.",
        body: "Chung cư phù hợp với người yêu thích tiện ích, an ninh và không muốn quản lý nhiều, trong khi nhà riêng lại có không gian rộng và linh hoạt hơn cho gia đình. Hãy cân nhắc ngân sách, nhu cầu di chuyển và sở thích cá nhân để lựa chọn loại hình phù hợp nhất.",
      },
    ],
  },
  {
    categorySlug: "tai-chinh-bat-dong-san",
    articles: [
      {
        title: "Vay mua nhà: chọn gói vay phù hợp với thu nhập",
        slug: "vay-mua-nha-chon-goi-vay-phu-hop-voi-thu-nhap",
        excerpt: "Cách tính khả năng vay vốn và lựa chọn gói vay có lãi suất hợp lý nhất.",
        body: "Trước khi vay mua nhà, bạn nên tính toán khoản vay sao cho tiền trả góp hàng tháng không vượt quá 30-40% thu nhập. So sánh lãi suất, thời hạn vay và phí phạt trả nợ trước hạn giữa các ngân hàng sẽ giúp bạn chọn được gói vay tối ưu.",
      },
      {
        title: "Các khoản thuế và chi phí phải đóng khi mua bán nhà đất",
        slug: "cac-khoan-thue-va-chi-phi-phai-dong-khi-mua-ban-nha-dat",
        excerpt: "Tổng hợp thuế, phí công chứng và các chi phí liên quan khi thực hiện giao dịch bất động sản.",
        body: "Khi mua bán nhà đất, người chuyển nhượng phải nộp thuế thu nhập cá nhân 2% trên giá chuyển nhượng, còn người mua phải trả lệ phí trước bạ 0,5%. Bên cạnh đó còn có phí công chứng, thẩm định và các chi phí khác tùy theo quy định từng địa phương.",
      },
      {
        title: "Cách quản lý dòng tiền khi đầu tư bất động sản",
        slug: "cach-quan-ly-dong-tien-khi-dau-tu-bat-dong-san",
        excerpt: "Nguyên tắc phân bổ vốn và quản lý dòng tiền giúp đầu tư bất động sản an toàn.",
        body: "Nhà đầu tư nên duy trì quỹ dự phòng và không dùng toàn bộ vốn liếng cho một giao dịch duy nhất. Việc theo dõi dòng tiền định kỳ, tính toán tỷ suất sinh lời và xác định điểm thoát hàng sẽ giúp giảm thiểu rủi ro khi thị trường biến động.",
      },
    ],
  },
  {
    categorySlug: "quy-hoach-phap-ly",
    articles: [
      {
        title: "Phân biệt sổ đỏ, sổ hồng và các giấy tờ pháp lý nhà đất",
        slug: "phan-biet-so-do-so-hong-va-cac-giay-to-phap-ly-nha-dat",
        excerpt: "Giải thích sự khác nhau giữa sổ đỏ, sổ hồng và các loại giấy tờ chứng nhận quyền sử dụng đất.",
        body: "Sổ đỏ là giấy chứng nhận quyền sử dụng đất do Bộ Tài nguyên và Môi trường cấp, còn sổ hồng là giấy chứng nhận quyền sở hữu nhà ở và tài sản gắn liền với đất. Hiểu rõ từng loại giấy tờ giúp bạn tránh nhầm lẫn khi giao dịch và xác minh tính pháp lý của bất động sản.",
      },
      {
        title: "Quy trình thủ tục chuyển nhượng nhà đất theo quy định mới",
        slug: "quy-trinh-thu-tuc-chuyen-nhuong-nha-dat-theo-quy-dinh-moi",
        excerpt: "Các bước thực hiện chuyển nhượng nhà đất từ công chứng đến đăng ký biến động.",
        body: "Quy trình chuyển nhượng nhà đất bao gồm công chứng hợp đồng, nộp hồ sơ tại văn phòng đăng ký đất đai và hoàn thành nghĩa vụ thuế. Việc chuẩn bị hồ sơ đầy đủ và thực hiện đúng trình tự sẽ giúp giao dịch diễn ra nhanh chóng và đúng pháp luật.",
      },
      {
        title: "Quy hoạch là gì và cách tra cứu quy hoạch đất chuẩn xác",
        slug: "quy-hoach-la-gi-va-cach-tra-cuu-quy-hoach-dat-chuan-xac",
        excerpt: "Khái niệm quy hoạch, các loại quy hoạch và cách tra cứu thông tin quy hoạch tại địa phương.",
        body: "Quy hoạch là kế hoạch sử dụng đất, xây dựng và phát triển hạ tầng của khu vực trong một giai đoạn nhất định. Bạn có thể tra cứu quy hoạch qua cổng thông tin điện tử của tỉnh, phòng tài nguyên môi trường hoặc văn phòng đăng ký đất đai nơi có bất động sản.",
      },
    ],
  },
  {
    categorySlug: "noi-ngoai-that",
    articles: [
      {
        title: "Phong cách thiết kế nội thất phổ biến cho căn hộ nhỏ",
        slug: "phong-cach-thiet-ke-noi-that-pho-bien-cho-can-ho-nho",
        excerpt: "Gợi ý phong cách nội thất tối giản, hiện đại giúp căn hộ nhỏ thoáng và tiện nghi.",
        body: "Với căn hộ nhỏ, phong cách tối giản kết hợp tông màu sáng và nội thất đa năng giúp không gian trở nên rộng rãi hơn. Sử dụng nội thất thông minh như giường tích hợp tủ, bàn gấp sẽ tối ưu diện tích mà vẫn đảm bảo sự tiện nghi.",
      },
      {
        title: "Mẹo bài trí ngoại thất sân vườn đẹp và bền",
        slug: "meo-bai-tri-ngoai-that-san-vuon-dep-va-ben",
        excerpt: "Cách bố trí cây xanh, ánh sáng và vật liệu để sân vườn luôn tươi đẹp quanh năm.",
        body: "Một sân vườn đẹp cần có sự kết hợp hài hòa giữa cây xanh, lối đi và khu vực thư giãn, đồng thời ưu tiên vật liệu chống thấm, chịu được thời tiết. Việc chọn cây phù hợp khí hậu và bố trí hệ thống thoát nước tốt sẽ giúp sân vườn bền đẹp và dễ chăm sóc.",
      },
      {
        title: "Chọn màu sơn nhà hợp phong thủy và thẩm mỹ",
        slug: "chon-mau-son-nha-hop-phong-thuy-va-tham-my",
        excerpt: "Cách chọn màu sơn theo mệnh gia chủ và xu hướng thiết kế hiện đại.",
        body: "Màu sơn nhà nên được lựa chọn dựa trên mệnh của gia chủ theo ngũ hành kết hợp với xu hướng thiết kế hiện đại. Ngoài ra, bạn cần cân nhắc diện tích và hướng sáng của ngôi nhà để chọn tông màu phù hợp, tạo cảm giác thoáng đãng và hài hòa.",
      },
    ],
  },
  {
    categorySlug: "phong-tuc",
    articles: [
      {
        title: "Các nghi thức quan trọng khi động thổ xây nhà",
        slug: "cac-nghi-thuc-quan-trong-khi-dong-tho-xay-nha",
        excerpt: "Hướng dẫn chọn ngày, chuẩn bị lễ vật và nghi thức động thổ theo phong tục truyền thống.",
        body: "Động thổ là nghi thức quan trọng trước khi xây dựng nhà, bao gồm việc chọn ngày lành, chuẩn bị lễ vật và tiến hành cúng động thổ theo phong tục địa phương. Việc thực hiện đầy đủ nghi thức thể hiện sự trang trọng và mong cầu sự thuận lợi cho quá trình xây dựng.",
      },
      {
        title: "Chọn ngày nhập trạch và lễ cúng nhà mới",
        slug: "chon-ngay-nhap-trach-va-le-cung-nha-moi",
        excerpt: "Cách xem ngày nhập trạch, chuẩn bị mâm cúng và những điều nên tránh khi vào nhà mới.",
        body: "Nhập trạch là nghi thức chuyển về nhà mới, thường được chọn ngày giờ tốt hợp với tuổi gia chủ. Trước khi vào nhà mới, gia chủ thường chuẩn bị mâm cúng gồm hương, hoa, trầu cau và gạo muối để xin phép thổ địa, cầu mong cuộc sống mới bình an và thịnh vượng.",
      },
      {
        title: "Những kiêng kỵ phong thủy khi xây dựng nhà ở",
        slug: "nhung-kieng-ky-phong-thuy-khi-xay-dung-nha-o",
        excerpt: "Các lưu ý phong thủy phổ biến về hướng nhà, cổng chính và bố trí không gian nên tránh.",
        body: "Khi xây dựng nhà, nhiều gia đình chú ý tránh đặt cổng chính đối diện cổng nhà hàng xóm, hướng nhà xung khắc tuổi gia chủ hoặc bố trí cầu thang thẳng ra cửa chính. Dù là quan niệm dân gian, việc tham khảo những lưu ý này giúp gia chủ yên tâm và cảm thấy cuộc sống thuận lợi hơn.",
      },
    ],
  },
];

const analysisArticles: Array<{ categorySlug: string; articles: WikiArticleSeed[] }> = [
  {
    categorySlug: "bieu-do-gia",
    articles: [
      {
        title: "Biểu đồ giá căn hộ chung cư Hà Nội 5 năm qua",
        slug: "bieu-do-gia-can-ho-chung-cu-ha-noi-5-nam-qua",
        excerpt: "Cập nhật diễn biến giá căn hộ chung cư tại Hà Nội theo từng quý, giúp bạn nắm bắt xu hướng thị trường.",
        body: "Biểu đồ giá căn hộ chung cư Hà Nội giai đoạn 5 năm gần đây cho thấy xu hướng tăng đều ở cả phân khúc trung cấp và cao cấp. Các quận ven đô như Hà Đông, Nam Từ Liêm ghi nhận mức tăng mạnh hơn khu vực trung tâm nhờ hạ tầng giao thông được đầu tư đồng bộ. Nhà đầu tư nên theo dõi biểu đồ giá theo từng địa bàn để lựa chọn thời điểm mua bán hợp lý.",
      },
      {
        title: "Biểu đồ giá đất nền TP.HCM theo từng quận",
        slug: "bieu-do-gia-dat-nen-tp-hcm-theo-tung-quan",
        excerpt: "So sánh mặt bằng giá đất nền giữa các quận huyện tại TP.HCM để chọn điểm đầu tư tiềm năng.",
        body: "Biểu đồ giá đất nền tại TP.HCM cho thấy sự phân hóa rõ rệt giữa các khu vực. Những quận có hạ tầng phát triển và quỹ đất hạn chế như quận 2, quận 7 tiếp tục dẫn đầu về mặt bằng giá, trong khi các huyện vùng ven như Bình Chánh, Củ Chi có mức giá thấp hơn nhưng tiềm năng tăng trưởng dài hạn. Việc đối chiếu biểu đồ giá theo từng địa bàn giúp nhà đầu tư đưa ra quyết định dựa trên dữ liệu thực tế.",
      },
    ],
  },
  {
    categorySlug: "video-danh-gia",
    articles: [
      {
        title: "Video đánh giá thị trường bất động sản quý mới nhất",
        slug: "video-danh-gia-thi-truong-bat-dong-san-quy-moi-nhat",
        excerpt: "Video tổng quan về diễn biến thị trường bất động sản, nguồn cung và thanh khoản trong quý gần nhất.",
        body: "Trong video đánh giá này, các chuyên gia điểm lại diễn biến chính của thị trường bất động sản trong quý: nguồn cung mới, tỷ lệ hấp thụ và tín hiệu từ phân khúc căn hộ, đất nền, nhà ở riêng lẻ. Video cũng đưa ra nhận định về thanh khoản và kỳ vọng của người mua trong thời gian tới, giúp người xem có cái nhìn tổng quan trước khi ra quyết định.",
      },
      {
        title: "Video phân tích tiềm năng dự án bất động sản ven đô",
        slug: "video-phan-tich-tiem-nang-du-an-bat-dong-san-ven-do",
        excerpt: "Đánh giá vị trí, hạ tầng và tiềm năng tăng giá của các dự án bất động sản tại khu vực ven đô.",
        body: "Video phân tích tiềm năng các dự án bất động sản ven đô thông qua các tiêu chí về vị trí, quy hoạch hạ tầng, tiện ích nội khu và pháp lý. Các chuyên gia trực tiếp khảo sát thực tế và so sánh mặt bằng giá với khu vực lân cận để đưa ra góc nhìn khách quan về mức độ phù hợp với từng nhóm khách hàng.",
      },
    ],
  },
  {
    categorySlug: "bao-cao-thi-truong",
    articles: [
      {
        title: "Báo cáo thị trường bất động sản Việt Nam quý mới nhất",
        slug: "bao-cao-thi-truong-bat-dong-san-viet-nam-quy-moi-nhat",
        excerpt: "Bức tranh toàn cảnh nguồn cung, giao dịch và mặt bằng giá bất động sản tại các thị trường trọng điểm.",
        body: "Báo cáo thị trường bất động sản Việt Nam quý gần nhất tổng hợp dữ liệu về nguồn cung mới, số lượng giao dịch thành công và biến động giá tại Hà Nội, TP.HCM và một số tỉnh thành trọng điểm. Báo cáo ghi nhận nguồn cung dần được cải thiện nhờ các dự án mới được cấp phép, đồng thời chỉ ra sự dịch chuyển của dòng vốn sang các phân khúc có thanh khoản tốt.",
      },
      {
        title: "Báo cáo nguồn cung và nhu cầu nhà ở tại các thành phố lớn",
        slug: "bao-cao-nguon-cung-va-nhu-cau-nha-o-tai-cac-thanh-pho-lon",
        excerpt: "Phân tích sự chênh lệch giữa nguồn cung và nhu cầu nhà ở tại các đô thị lớn của Việt Nam.",
        body: "Báo cáo nguồn cung và nhu cầu nhà ở tại các thành phố lớn cho thấy khoảng cách giữa lượng cầu thực và nguồn cung sản phẩm phù hợp vẫn còn khá lớn, đặc biệt ở phân khúc nhà ở bình dân và trung cấp. Cơ cấu nguồn cung mới đang nghiêng về phân khúc cao cấp trong khi nhu cầu chủ yếu đến từ người mua nhà ở thực, đặt ra bài toán tái cân bằng cho thị trường.",
      },
    ],
  },
  {
    categorySlug: "goc-nhin-chuyen-gia",
    articles: [
      {
        title: "Chuyên gia nhận định xu hướng giá bất động sản thời gian tới",
        slug: "chuyen-gia-nhan-dinh-xu-huong-gia-bat-dong-san-thoi-gian-toi",
        excerpt: "Các chuyên gia chia sẻ nhận định về xu hướng giá bất động sản dựa trên các yếu tố vĩ mô và cung cầu.",
        body: "Theo các chuyên gia, giá bất động sản thời gian tới sẽ diễn biến thận trọng, phân hóa rõ giữa các phân khúc và khu vực. Các dự án có pháp lý hoàn chỉnh, vị trí tốt và mức giá hợp lý vẫn được săn đón, trong khi những sản phẩm định giá quá cao so với giá trị thực sẽ gặp khó khăn trong thanh khoản. Yếu tố lãi suất và nguồn vốn được nhận định là động lực chính chi phối thị trường.",
      },
      {
        title: "Góc nhìn chuyên gia: Cơ hội đầu tư bất động sản nghỉ dưỡng",
        slug: "goc-nhin-chuyen-gia-co-hoi-dau-tu-bat-dong-san-nghi-duong",
        excerpt: "Đánh giá tiềm năng và rủi ro khi đầu tư vào phân khúc bất động sản nghỉ dưỡng tại các điểm đến du lịch.",
        body: "Phân khúc bất động sản nghỉ dưỡng tại các điểm đến du lịch trọng điểm đang thu hút sự quan tâm của nhà đầu tư nhờ tiềm năng khai thác cho thuê. Tuy nhiên, các chuyên gia lưu ý nhà đầu tư cần thận trọng với các cam kết lợi nhuận, kiểm tra kỹ pháp lý dự án và đánh giá khách quan về công suất khai thác thực tế trước khi xuống tiền.",
      },
    ],
  },
  {
    categorySlug: "interkative-story",
    articles: [
      {
        title: "Interkative Story: Hành trình tìm nhà của một gia đình trẻ",
        slug: "interkative-story-hanh-trinh-tim-nha-cua-mot-gia-dinh-tre",
        excerpt: "Câu chuyện tương tác về hành trình chọn mua căn hộ đầu tiên của một gia đình trẻ tại thành phố lớn.",
        body: "Interkative Story đưa người đọc bước vào hành trình tìm nhà của một gia đình trẻ: từ việc xác định ngân sách, lọc dự án theo vị trí và tiện ích, đến khảo sát thực tế và đàm phán giá. Qua từng bước, bạn sẽ đối mặt với những lựa chọn quen thuộc trong quá trình mua nhà và hiểu hơn về cách các gia đình trẻ đưa ra quyết định.",
      },
      {
        title: "Interkative Story: Từ ý tưởng đến căn hộ trong mơ",
        slug: "interkative-story-tu-y-tuong-den-can-ho-trong-mo",
        excerpt: "Câu chuyện tương tác tái hiện quá trình lên ý tưởng, thiết kế và hoàn thiện không gian căn hộ trong mơ.",
        body: "Câu chuyện tương tác này tái hiện toàn bộ quá trình biến một ý tưởng thành căn hộ trong mơ: lựa chọn phong cách thiết kế, bố trí công năng, chọn vật liệu và bài trí nội thất. Người đọc sẽ được trải nghiệm các quyết định thiết kế điển hình và nhận những gợi ý thực tế để tối ưu không gian sống của chính mình.",
      },
    ],
  },
];

async function main() {
  const phongTuc = await prisma.articleCategory.upsert({
    where: { slug: PHONG_TUC_CATEGORY.slug },
    create: PHONG_TUC_CATEGORY,
    update: {
      name: PHONG_TUC_CATEGORY.name,
      description: PHONG_TUC_CATEGORY.description,
    },
  });
  console.log(`category: ${phongTuc.slug} -> ${phongTuc.name} (id=${phongTuc.id})`);

  let articleCount = 0;
  let mediaCount = 0;

  for (const group of wikiArticles) {
    const category = await prisma.articleCategory.findUniqueOrThrow({
      where: { slug: group.categorySlug },
      select: { id: true, name: true },
    });

    for (const [index, article] of group.articles.entries()) {
      const imageIndex = (articleCount + index) % UNSPLASH_IMAGES.length;
      const storageKey = `seed/wiki/${article.slug}.jpg`;

      const media = await prisma.media.upsert({
        where: { storageKey },
        create: {
          storageKey,
          publicUrl: UNSPLASH_IMAGES[imageIndex],
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 675,
          status: "approved",
        },
        update: {
          publicUrl: UNSPLASH_IMAGES[imageIndex],
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 675,
          status: "approved",
        },
        select: { id: true },
      });
      mediaCount += 1;

      const publishedAt = new Date(Date.now() - (articleCount + index) * 37 * 60 * 60 * 1000 - Math.random() * 6 * 60 * 60 * 1000);

      const record = await prisma.article.upsert({
        where: { slug: article.slug },
        create: {
          categoryId: category.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          body: article.body,
          coverMediaId: media.id,
          status: "published",
          seoTitle: article.title,
          seoDescription: article.excerpt,
          publishedAt,
        },
        update: {
          categoryId: category.id,
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
          coverMediaId: media.id,
          status: "published",
          seoTitle: article.title,
          seoDescription: article.excerpt,
          publishedAt,
        },
        select: { id: true },
      });

      articleCount += 1;
      console.log(`article: ${category.name} -> ${article.slug} (id=${record.id})`);
    }
  }

  const wikiCategories = await prisma.articleCategory.findMany({
    where: { slug: { in: WIKI_CATEGORY_SLUGS } },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const publishedWikiArticles = await prisma.article.count({
    where: {
      status: "published",
      publishedAt: { not: null },
      category: { slug: { in: WIKI_CATEGORY_SLUGS } },
    },
  });

  let newAnalysisCategoryCount = 0;
  for (const categoryData of ANALYSIS_CATEGORIES) {
    const existing = await prisma.articleCategory.findUnique({
      where: { slug: categoryData.slug },
      select: { id: true },
    });
    const category = await prisma.articleCategory.upsert({
      where: { slug: categoryData.slug },
      create: categoryData,
      update: {
        name: categoryData.name,
        description: categoryData.description,
      },
      select: { id: true },
    });
    if (!existing) {
      newAnalysisCategoryCount += 1;
      console.log(`category: ${categoryData.slug} -> ${categoryData.name} (id=${category.id})`);
    } else {
      console.log(`category: ${categoryData.slug} -> ${categoryData.name} (updated)`);
    }
  }

  let newAnalysisArticleCount = 0;
  let analysisIndex = articleCount;
  for (const group of analysisArticles) {
    const existingCount = await prisma.article.count({
      where: {
        category: { slug: group.categorySlug },
        status: "published",
      },
    });

    if (existingCount >= 2) {
      console.log(`analysis category ${group.categorySlug}: ${existingCount} published articles, skipping`);
      continue;
    }

    const category = await prisma.articleCategory.findUniqueOrThrow({
      where: { slug: group.categorySlug },
      select: { id: true, name: true },
    });

    for (const [index, article] of group.articles.entries()) {
      const imageIndex = (analysisIndex + index) % UNSPLASH_IMAGES.length;
      const storageKey = `seed/analysis/${article.slug}.jpg`;

      const media = await prisma.media.upsert({
        where: { storageKey },
        create: {
          storageKey,
          publicUrl: UNSPLASH_IMAGES[imageIndex],
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 675,
          status: "approved",
        },
        update: {
          publicUrl: UNSPLASH_IMAGES[imageIndex],
          mimeType: "image/jpeg",
          sizeBytes: 600000,
          width: 1200,
          height: 675,
          status: "approved",
        },
        select: { id: true },
      });

      const publishedAt = new Date(Date.now() - (analysisIndex + index) * 29 * 60 * 60 * 1000 - Math.random() * 6 * 60 * 60 * 1000);

      const existingArticle = await prisma.article.findUnique({
        where: { slug: article.slug },
        select: { id: true },
      });

      const record = await prisma.article.upsert({
        where: { slug: article.slug },
        create: {
          categoryId: category.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          body: article.body,
          coverMediaId: media.id,
          status: "published",
          seoTitle: article.title,
          seoDescription: article.excerpt,
          publishedAt,
        },
        update: {
          categoryId: category.id,
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
          coverMediaId: media.id,
          status: "published",
          seoTitle: article.title,
          seoDescription: article.excerpt,
          publishedAt,
        },
        select: { id: true },
      });

      if (!existingArticle) {
        newAnalysisArticleCount += 1;
      }
      console.log(`article: ${category.name} -> ${article.slug} (id=${record.id})`);
    }

    analysisIndex += group.articles.length;
  }

  const analysisCategories = await prisma.articleCategory.findMany({
    where: { slug: { in: ANALYSIS_CATEGORY_SLUGS } },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  const publishedAnalysisArticles = await prisma.article.count({
    where: {
      status: "published",
      publishedAt: { not: null },
      category: { slug: { in: ANALYSIS_CATEGORY_SLUGS } },
    },
  });

  console.log(`total wiki categories: ${wikiCategories.length}`);
  console.log(`total wiki articles upserted: ${articleCount} (media upserted: ${mediaCount})`);
  console.log(`total published wiki articles in DB: ${publishedWikiArticles}`);
  console.log(`total analysis categories: ${analysisCategories.length} (new: ${newAnalysisCategoryCount})`);
  console.log(`new analysis articles created: ${newAnalysisArticleCount}`);
  console.log(`total published analysis articles in DB: ${publishedAnalysisArticles}`);

  const allArticles = await prisma.article.findMany({
    orderBy: [{ createdAt: "asc" }],
    select: { id: true, viewCount: true },
  });

  let viewCountSeeded = 0;
  for (const [index, item] of allArticles.entries()) {
    if (item.viewCount > 0) {
      continue;
    }
    await prisma.article.update({
      where: { id: item.id },
      data: { viewCount: 100 + ((index * 137) % 900) },
    });
    viewCountSeeded += 1;
  }

  console.log(`viewCount seeded: ${viewCountSeeded}`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
