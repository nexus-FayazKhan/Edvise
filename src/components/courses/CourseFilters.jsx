import PropTypes from 'prop-types';

const CourseFilters = ({ onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filter Courses
      </h3>
      
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories
          </label>
          <select
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Categories</option>
            <option value="academic">Academic</option>
            <option value="wellbeing">Well-being</option>
            <option value="career">Career</option>
            <option value="tools">Tools</option>
          </select>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level
          </label>
          <div className="space-y-2">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange('difficulty', level, e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration
          </label>
          <div className="space-y-2">
            {[
              { label: 'Short (< 4 weeks)', value: 'short' },
              { label: 'Medium (4-8 weeks)', value: 'medium' },
              { label: 'Long (> 8 weeks)', value: 'long' }
            ].map((duration) => (
              <label key={duration.value} className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange('duration', duration.value, e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {duration.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="popularity">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  );
};

CourseFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default CourseFilters;
