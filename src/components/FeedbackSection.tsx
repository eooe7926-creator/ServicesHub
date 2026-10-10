import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, User, Sparkles } from 'lucide-react';

export interface CommentItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    name: 'محمود عبد الفتاح',
    rating: 5,
    comment: 'أفضل كشري أكلته في مصر! التقلية مقرمشة جداً والصلصة متسبكة صح على أصولها.',
    date: 'منذ ١٥ دقيقة',
  },
  {
    id: 'c2',
    name: 'سارة إبراهيم',
    rating: 5,
    comment: 'طاجن المكرونة باللحمة المفرومة وصل سخن مولع، والأرز باللبن تحفة بعد الأكل!',
    date: 'منذ ساعة',
  },
  {
    id: 'c3',
    name: 'عمر خالد',
    rating: 4,
    comment: 'توصيل سريع وخدمة ممتازة، شطة الزيت نار بجد لعشاق الحامي.',
    date: 'منذ ساعتين',
  },
];

export const FeedbackSection: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem('koshary_feedback_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('koshary_feedback_comments', JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRating === 0 || !username.trim() || !comment.trim()) {
      setErrorMessage('يرجى تقييم الخدمة وإدخال الاسم والتعليق.');
      return;
    }

    const newCommentItem: CommentItem = {
      id: `comm-${Date.now()}`,
      name: username.trim(),
      rating: selectedRating,
      comment: comment.trim(),
      date: 'الآن',
    };

    setComments((prev) => [newCommentItem, ...prev]);
    setUsername('');
    setComment('');
    setSelectedRating(5);
    setErrorMessage(null);
    setSuccessToast('شكراً لتقييمك الكريم! تم نشر رأيك في قائمة التعليقات.');

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <section className="mt-10 pt-8 border-t-2 border-stone-200 feedback-section text-right">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>آراء زبائن كشري هاند</span>
          </div>
          <h3 className="text-2xl font-black text-stone-900">شاركنا رأيك وتقييمك</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            رأيك يهمنا دائماً لتطوير أفضل جودة في أطباق الكشري المصري الأصيل
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitFeedback} className="max-w-md mx-auto space-y-4">
          {/* Star Rating */}
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-stone-600">اختر عدد النجوم:</span>
            <div
              className="flex justify-center items-center gap-2 py-1 select-none"
              id="star-rating"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isLit = (hoverRating || selectedRating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => {
                      setSelectedRating(starValue);
                      setErrorMessage(null);
                    }}
                    onMouseEnter={() => setHoverRating(starValue)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    aria-label={`تقييم ${starValue} نجوم`}
                    data-value={starValue}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isLit
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-amber-700 font-mono">
              {hoverRating || selectedRating} من ٥ نجوم
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Success Toast */}
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 text-center font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Input Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="username-feedback">
              اسمك الكريم <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                id="username-feedback"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="الاسم الكريم"
                className="w-full text-xs pr-10 pl-3 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          {/* Input Comment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="user-comment">
              التعليق والتقييم <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                id="user-comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="اكتب تعليقك هنا..."
                className="w-full text-xs pr-10 pl-3 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
          >
            <span>إرسال التقييم</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Comments List */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-stone-900">
              أحدث تعليقات وتقييمات العملاء ({comments.length})
            </h4>
            <span className="text-[11px] text-stone-400">محدث لحظياً</span>
          </div>

          <ul className="space-y-2.5 comments-list" id="comments-list">
            {comments.map((item) => (
              <li
                key={item.id}
                className="bg-stone-50/80 p-3.5 rounded-xl border-r-4 border-amber-600 border border-stone-200/60 shadow-xs comment-item transition-all hover:bg-amber-50/30"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-stone-900 text-xs font-bold">
                      {item.name}
                    </strong>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < item.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] font-bold text-amber-800 font-mono mr-1">
                        ({item.rating} ★)
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400">{item.date}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pr-0.5">
                  {item.comment}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
