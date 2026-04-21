export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const GREENIFY_FAQS: FAQItem[] = [
  {
    id: 1,
    question: 'Greenify là gì?',
    answer:
      'Greenify là một nền tảng khuyến khích người dùng xây dựng lối sống xanh thông qua các hoạt động thiết thực như đăng hành động xanh, tham gia sự kiện môi trường, tích điểm, đổi quà và theo dõi hành trình phát triển của bản thân. Ứng dụng không chỉ ghi nhận đóng góp cá nhân mà còn tạo ra một cộng đồng cùng nhau lan tỏa các giá trị bền vững.',
  },
  {
    id: 2,
    question: 'Tôi cần làm gì để bắt đầu sử dụng Greenify?',
    answer:
      'Để bắt đầu, bạn chỉ cần đăng ký tài khoản và đăng nhập vào hệ thống. Sau đó, bạn có thể cập nhật hồ sơ cá nhân, khám phá các tính năng như đăng bài hành động xanh, tham gia sự kiện, tích điểm, theo dõi bảng xếp hạng và sử dụng những tiện ích khác mà Greenify cung cấp.',
  },
  {
    id: 3,
    question: 'Nếu tôi quên mật khẩu thì phải làm sao?',
    answer:
      'Khi quên mật khẩu, bạn chỉ cần chọn chức năng “Quên mật khẩu” tại màn hình đăng nhập và làm theo hướng dẫn của hệ thống. Sau khi xác minh thông tin thành công, bạn sẽ được hỗ trợ đặt lại mật khẩu mới để tiếp tục sử dụng tài khoản một cách bình thường.',
  },
  {
    id: 4,
    question: 'Hồ sơ cá nhân trên Greenify dùng để làm gì?',
    answer:
      'Hồ sơ cá nhân là nơi hiển thị các thông tin cơ bản của bạn và tổng hợp toàn bộ quá trình tham gia Greenify. Tại đây, bạn có thể theo dõi điểm xanh, các hoạt động đã thực hiện, thành tích đạt được, streak duy trì và tiến trình phát triển trong ứng dụng, từ đó có cái nhìn rõ hơn về hành trình sống xanh của mình.',
  },
  {
    id: 5,
    question: 'Hành động xanh là gì?',
    answer:
      'Hành động xanh là những việc làm tích cực góp phần bảo vệ môi trường, chẳng hạn như nhặt rác, phân loại rác, tái chế, trồng cây, hạn chế nhựa dùng một lần hoặc tham gia các hoạt động vì cộng đồng. Trên Greenify, người dùng có thể ghi nhận những hành động này bằng cách đăng bài kèm minh chứng để hệ thống xem xét và công nhận.',
  },
  {
    id: 6,
    question: 'Tôi đăng hành động xanh như thế nào?',
    answer:
      'Bạn có thể vào chức năng tạo bài viết, tải lên hình ảnh minh chứng, nhập mô tả nội dung hoạt động và gửi bài lên hệ thống. Sau khi được gửi, bài viết sẽ đi qua quy trình kiểm tra hoặc xét duyệt trước khi được ghi nhận chính thức, tùy theo quy định vận hành của nền tảng.',
  },
  {
    id: 7,
    question: 'Vì sao bài hành động xanh của tôi chưa được duyệt?',
    answer:
      'Bài viết của bạn có thể đang ở trạng thái chờ kiểm tra, đặc biệt khi hệ thống cần thêm thời gian để xác minh nội dung hoặc minh chứng. Ngoài ra, việc chậm duyệt cũng có thể xảy ra nếu bài viết chưa rõ ràng, thiếu thông tin cần thiết hoặc đang được đưa vào diện rà soát kỹ hơn để đảm bảo tính minh bạch và công bằng.',
  },
  {
    id: 8,
    question: 'Vì sao bài viết của tôi bị từ chối?',
    answer:
      'Một bài viết có thể bị từ chối nếu nội dung không phù hợp với tiêu chí hành động xanh, ảnh minh chứng không rõ ràng, thông tin mô tả không đủ thuyết phục, bị trùng lặp hoặc có dấu hiệu vi phạm quy định cộng đồng. Trong trường hợp này, người dùng nên kiểm tra lại nội dung bài đăng và bổ sung minh chứng đầy đủ hơn ở lần gửi sau.',
  },
  {
    id: 9,
    question: 'Điểm xanh dùng để làm gì?',
    answer:
      'Điểm xanh là phần thưởng ghi nhận cho những đóng góp tích cực của bạn trên Greenify. Điểm này có thể được dùng để theo dõi thành tích cá nhân, tham gia bảng xếp hạng, mở khóa một số quyền lợi và đổi lấy voucher hoặc các phần quà do hệ thống và đối tác cung cấp trong từng giai đoạn.',
  },
  {
    id: 10,
    question: 'Tôi nhận điểm xanh từ đâu?',
    answer:
      'Bạn có thể nhận điểm khi thực hiện thành công các hành động xanh hợp lệ, tham gia sự kiện môi trường, duy trì streak hoặc hoàn thành một số nhiệm vụ mà hệ thống đặt ra. Tuy nhiên, điểm chỉ được cộng khi hoạt động của bạn đáp ứng đúng điều kiện ghi nhận và đã được hệ thống hoặc bộ phận xét duyệt xác minh.',
  },
  {
    id: 11,
    question: 'Vì sao điểm của tôi chưa được cộng hoặc bị thay đổi?',
    answer:
      'Điểm có thể chưa được cộng ngay nếu bài viết hoặc hoạt động của bạn vẫn đang chờ duyệt. Trong một số trường hợp, điểm cũng có thể bị điều chỉnh hoặc thu hồi nếu nội dung sau đó bị xác định là không hợp lệ, có sai sót dữ liệu hoặc vi phạm quy định của hệ thống.',
  },
  {
    id: 12,
    question: 'Tôi đổi voucher như thế nào?',
    answer:
      'Bạn chỉ cần truy cập mục voucher, chọn phần quà phù hợp với số điểm hiện có và thực hiện xác nhận đổi thưởng. Sau khi đổi thành công, voucher sẽ được lưu trong tài khoản của bạn để sử dụng theo điều kiện áp dụng cụ thể của từng chương trình hoặc từng đối tác.',
  },
  {
    id: 13,
    question: 'Vì sao tôi không đổi được voucher?',
    answer:
      'Có nhiều nguyên nhân khiến bạn chưa thể đổi voucher, chẳng hạn như chưa đủ điểm, voucher đã hết số lượng, hết hạn sử dụng hoặc chương trình đang tạm ngưng. Ngoài ra, trong một số tình huống hiếm, lỗi đồng bộ hệ thống cũng có thể làm quá trình đổi thưởng chưa hoàn tất ngay lập tức.',
  },
  {
    id: 14,
    question: 'Streak là gì và vì sao nó quan trọng?',
    answer:
      'Streak là chuỗi ngày bạn duy trì hoạt động xanh liên tục trên Greenify. Đây là một cách để hệ thống ghi nhận sự đều đặn và cam kết của bạn đối với lối sống bền vững, đồng thời giúp tăng tính động lực, tạo cảm giác tiến bộ và có thể gắn với các phần thưởng hoặc mốc thành tích trong ứng dụng.',
  },
  {
    id: 15,
    question: 'Vườn cây trong Greenify hoạt động như thế nào?',
    answer:
      'Vườn cây là tính năng mang tính gamification, giúp người dùng nhìn thấy quá trình phát triển của “cây xanh” dựa trên mức độ tham gia và duy trì hoạt động trong hệ thống. Khi bạn tích cực thực hiện hành động xanh, giữ streak hoặc đạt các mốc nhất định, cây của bạn sẽ dần phát triển qua nhiều giai đoạn, tạo cảm giác thú vị và trực quan hơn khi sử dụng ứng dụng.',
  },
  {
    id: 16,
    question: 'Tôi có thể trở thành CTV không?',
    answer:
      'Có. Nếu bạn đáp ứng các điều kiện mà Greenify đặt ra, chẳng hạn như mức độ hoạt động, điểm tích lũy, lịch sử tham gia tích cực hoặc các tiêu chí xét duyệt khác, bạn có thể gửi yêu cầu để được xem xét trở thành Cộng tác viên. Đây là vai trò giúp bạn tham gia sâu hơn vào quá trình hỗ trợ và đóng góp cho cộng đồng.',
  },
  {
    id: 17,
    question: 'NGO có thể làm gì trên Greenify?',
    answer:
      'Tổ chức hoặc NGO có thể sử dụng Greenify để xây dựng hồ sơ tổ chức, tạo sự kiện môi trường, kết nối với người dùng và lan tỏa các hoạt động cộng đồng. Tuy nhiên, để đảm bảo độ tin cậy, các thông tin hoặc sự kiện do NGO tạo ra có thể cần đi qua bước xác minh hoặc phê duyệt trước khi hiển thị công khai trên hệ thống.',
  },
  {
    id: 18,
    question: 'Tôi đăng ký tham gia sự kiện môi trường như thế nào?',
    answer:
      'Bạn có thể vào danh sách sự kiện, chọn sự kiện mình quan tâm, xem chi tiết nội dung rồi thực hiện đăng ký trực tiếp trên ứng dụng. Sau khi đăng ký thành công, hệ thống sẽ lưu trạng thái tham gia của bạn và có thể gửi thêm thông báo liên quan như thời gian, địa điểm hoặc hướng dẫn check-in khi sự kiện diễn ra.',
  },
  {
    id: 19,
    question: 'Báo điểm rác là gì?',
    answer:
      'Báo điểm rác là tính năng cho phép người dùng ghi nhận và gửi thông tin về những khu vực có rác thải hoặc cần được xử lý. Khi bạn gửi báo cáo kèm hình ảnh và vị trí, hệ thống sẽ tiếp nhận để phục vụ cho việc theo dõi, chuyển xử lý hoặc hỗ trợ kết nối với các bên liên quan như admin, cộng tác viên hoặc tổ chức môi trường.',
  },
  {
    id: 20,
    question: 'Tôi liên hệ hỗ trợ Greenify ở đâu?',
    answer:
      'Nếu gặp sự cố trong quá trình sử dụng, bạn có thể liên hệ thông qua mục hỗ trợ trong ứng dụng hoặc qua kênh liên hệ chính thức của Greenify. Bộ phận hỗ trợ sẽ giúp bạn giải đáp các vấn đề liên quan đến tài khoản, bài viết, điểm thưởng, voucher, sự kiện và các lỗi phát sinh trong quá trình trải nghiệm.',
  },
];
