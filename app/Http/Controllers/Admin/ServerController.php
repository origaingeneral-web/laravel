<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ServerController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/system/server', [
            'serverInfo' => $this->getServerInfo(),
            'phpConfig' => $this->getPhpConfig(),
            'extensions' => $this->getExtensions(),
            'permissions' => $this->getFilesystemPermissions(),
        ]);
    }

    /**
     * Get general server and environment information.
     */
    protected function getServerInfo(): array
    {
        // Database version
        $dbVersion = 'Unknown';
        $dbDriver = config('database.default', 'mysql');
        try {
            $pdo = DB::connection()->getPdo();
            $dbVersion = $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION) ?: 'Connected';
        } catch (\Throwable $e) {
            $dbVersion = 'Disconnected ('.$e->getMessage().')';
        }

        // Disk space calculations
        $basePath = base_path();
        $diskTotal = @disk_total_space($basePath) ?: 0;
        $diskFree = @disk_free_space($basePath) ?: 0;
        $diskUsed = $diskTotal > 0 ? $diskTotal - $diskFree : 0;
        $diskUsedPercent = $diskTotal > 0 ? round(($diskUsed / $diskTotal) * 100, 1) : 0;

        // Memory usage
        $memoryUsage = memory_get_usage(true);
        $memoryPeak = memory_get_peak_usage(true);

        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'os' => php_uname('s').' '.php_uname('r'),
            'os_family' => PHP_OS_FAMILY,
            'architecture' => php_uname('m'),
            'web_server' => $_SERVER['SERVER_SOFTWARE'] ?? (PHP_SAPI === 'cli' ? 'CLI / Built-in' : PHP_SAPI),
            'server_ip' => $_SERVER['SERVER_ADDR'] ?? gethostbyname(gethostname()),
            'server_hostname' => gethostname() ?: 'localhost',
            'server_protocol' => $_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1',
            'server_port' => $_SERVER['SERVER_PORT'] ?? 80,
            'server_time' => now()->toDateTimeString(),
            'timezone' => config('app.timezone', date_default_timezone_get()),
            'environment' => app()->environment(),
            'debug_mode' => (bool) config('app.debug'),
            'https' => request()->secure(),
            'db_driver' => $dbDriver,
            'db_name' => config("database.connections.{$dbDriver}.database", 'laravel'),
            'db_version' => $dbVersion,
            'memory_usage' => $this->formatBytes($memoryUsage),
            'memory_peak' => $this->formatBytes($memoryPeak),
            'memory_raw' => $memoryUsage,
            'disk_total' => $this->formatBytes($diskTotal),
            'disk_free' => $this->formatBytes($diskFree),
            'disk_used' => $this->formatBytes($diskUsed),
            'disk_used_percent' => $diskUsedPercent,
        ];
    }

    /**
     * Get PHP.ini configuration directives.
     */
    protected function getPhpConfig(): array
    {
        $directives = [
            [
                'directive' => 'upload_max_filesize',
                'current' => ini_get('upload_max_filesize') ?: 'N/A',
                'recommended' => '>= 16M',
                'description' => 'Maximum allowed size for uploaded files.',
            ],
            [
                'directive' => 'post_max_size',
                'current' => ini_get('post_max_size') ?: 'N/A',
                'recommended' => '>= 32M',
                'description' => 'Maximum size of POST data that PHP will accept.',
            ],
            [
                'directive' => 'memory_limit',
                'current' => ini_get('memory_limit') ?: 'N/A',
                'recommended' => '>= 256M',
                'description' => 'Maximum amount of memory a script may consume.',
            ],
            [
                'directive' => 'max_execution_time',
                'current' => (ini_get('max_execution_time') ?: '0').'s',
                'recommended' => '>= 60s',
                'description' => 'Maximum time in seconds a script is allowed to run.',
            ],
            [
                'directive' => 'max_input_time',
                'current' => (ini_get('max_input_time') ?: '0').'s',
                'recommended' => '>= 60s',
                'description' => 'Maximum time in seconds a script is allowed to parse input data.',
            ],
            [
                'directive' => 'max_input_vars',
                'current' => ini_get('max_input_vars') ?: 'N/A',
                'recommended' => '>= 1000',
                'description' => 'How many input variables may be accepted.',
            ],
            [
                'directive' => 'display_errors',
                'current' => ini_get('display_errors') ? 'On' : 'Off',
                'recommended' => app()->isProduction() ? 'Off' : 'On',
                'description' => 'Determines whether errors should be printed to the screen.',
            ],
            [
                'directive' => 'error_reporting',
                'current' => (string) ini_get('error_reporting'),
                'recommended' => 'E_ALL',
                'description' => 'Error reporting level bitmask.',
            ],
            [
                'directive' => 'allow_url_fopen',
                'current' => ini_get('allow_url_fopen') ? 'On' : 'Off',
                'recommended' => 'On',
                'description' => 'Allows PHP file functions to retrieve data from remote URLs.',
            ],
            [
                'directive' => 'file_uploads',
                'current' => ini_get('file_uploads') ? 'On' : 'Off',
                'recommended' => 'On',
                'description' => 'Whether or not to allow HTTP file uploads.',
            ],
            [
                'directive' => 'default_socket_timeout',
                'current' => (ini_get('default_socket_timeout') ?: '60').'s',
                'recommended' => '>= 60s',
                'description' => 'Default timeout for socket-based streams.',
            ],
            [
                'directive' => 'session.gc_maxlifetime',
                'current' => (ini_get('session.gc_maxlifetime') ?: '1440').'s',
                'recommended' => '>= 1440s',
                'description' => 'Session lifetime before garbage collection clean up.',
            ],
            [
                'directive' => 'opcache.enable',
                'current' => ini_get('opcache.enable') ? 'Enabled' : 'Disabled',
                'recommended' => 'Enabled (in Production)',
                'description' => 'Enables the opcode cache for maximum performance.',
            ],
        ];

        return [
            'loaded_ini' => php_ini_loaded_file() ?: 'None',
            'scanned_inis' => php_ini_scanned_files() ? explode(',', php_ini_scanned_files()) : [],
            'directives' => $directives,
        ];
    }

    /**
     * Get installed and required PHP extensions.
     */
    protected function getExtensions(): array
    {
        $critical = [
            ['name' => 'OpenSSL', 'required' => true, 'desc' => 'Secure cryptographic communications & HTTPS'],
            ['name' => 'PDO', 'required' => true, 'desc' => 'Database abstraction layer'],
            ['name' => 'pdo_mysql', 'required' => false, 'desc' => 'MySQL database driver'],
            ['name' => 'Mbstring', 'required' => true, 'desc' => 'Multibyte character string processing'],
            ['name' => 'Tokenizer', 'required' => true, 'desc' => 'PHP source code tokenization'],
            ['name' => 'XML', 'required' => true, 'desc' => 'XML documents parsing & manipulation'],
            ['name' => 'Ctype', 'required' => true, 'desc' => 'Character type checking functions'],
            ['name' => 'JSON', 'required' => true, 'desc' => 'JavaScript Object Notation serialization'],
            ['name' => 'cURL', 'required' => true, 'desc' => 'HTTP client library for web APIs & payments'],
            ['name' => 'Fileinfo', 'required' => true, 'desc' => 'MIME type file detection & uploads'],
            ['name' => 'GD', 'required' => false, 'desc' => 'Image creation, resizing & QR processing'],
            ['name' => 'Zip', 'required' => false, 'desc' => 'ZIP archive compression & file extraction'],
            ['name' => 'BCMath', 'required' => true, 'desc' => 'Arbitrary precision mathematics (Payments)'],
            ['name' => 'Intl', 'required' => false, 'desc' => 'Internationalization & currency formatting'],
            ['name' => 'Sodium', 'required' => false, 'desc' => 'Modern cryptography & password hashing'],
            ['name' => 'Redis', 'required' => false, 'desc' => 'In-memory cache & fast queue processing'],
        ];

        $checked = [];
        foreach ($critical as $ext) {
            $isLoaded = extension_loaded($ext['name']);
            $checked[] = [
                'name' => $ext['name'],
                'installed' => $isLoaded,
                'version' => $isLoaded ? (phpversion($ext['name']) ?: 'Loaded') : 'Not Installed',
                'required' => $ext['required'],
                'description' => $ext['desc'],
            ];
        }

        // All loaded extensions
        $allExtensions = get_loaded_extensions();
        sort($allExtensions, SORT_NATURAL | SORT_FLAG_CASE);

        $allWithVersion = [];
        foreach ($allExtensions as $extName) {
            $allWithVersion[] = [
                'name' => $extName,
                'version' => phpversion($extName) ?: 'Installed',
            ];
        }

        return [
            'critical' => $checked,
            'all' => $allWithVersion,
            'total_count' => count($allExtensions),
        ];
    }

    /**
     * Check filesystem permissions for critical directories.
     */
    protected function getFilesystemPermissions(): array
    {
        $directories = [
            ['label' => 'storage/', 'path' => storage_path(), 'required' => 'Writable (0775 / 0755)'],
            ['label' => 'storage/app/', 'path' => storage_path('app'), 'required' => 'Writable (0775)'],
            ['label' => 'storage/app/public/', 'path' => storage_path('app/public'), 'required' => 'Writable (0775)'],
            ['label' => 'storage/framework/', 'path' => storage_path('framework'), 'required' => 'Writable (0775)'],
            ['label' => 'storage/framework/cache/', 'path' => storage_path('framework/cache'), 'required' => 'Writable (0775)'],
            ['label' => 'storage/framework/sessions/', 'path' => storage_path('framework/sessions'), 'required' => 'Writable (0775)'],
            ['label' => 'storage/framework/views/', 'path' => storage_path('framework/views'), 'required' => 'Writable (0775)'],
            ['label' => 'storage/logs/', 'path' => storage_path('logs'), 'required' => 'Writable (0775)'],
            ['label' => 'bootstrap/cache/', 'path' => base_path('bootstrap/cache'), 'required' => 'Writable (0775)'],
            ['label' => 'public/', 'path' => public_path(), 'required' => 'Readable & Executable (0755)'],
            ['label' => 'public/storage/ (Symlink)', 'path' => public_path('storage'), 'required' => 'Linked to storage/app/public'],
            ['label' => '.env (Environment Config)', 'path' => base_path('.env'), 'required' => 'Readable (0600 / 0644)'],
        ];

        $results = [];
        foreach ($directories as $dir) {
            $path = $dir['path'];
            $exists = file_exists($path);
            $isWritable = $exists && is_writable($path);
            $isReadable = $exists && is_readable($path);
            $perms = $exists ? substr(sprintf('%o', fileperms($path)), -4) : 'N/A';
            $isLink = is_link($path);

            $status = 'ok';
            if (! $exists) {
                $status = 'missing';
            } elseif (! $isWritable && str_contains($dir['required'], 'Writable')) {
                $status = 'warning';
            }

            $results[] = [
                'label' => $dir['label'],
                'path' => $path,
                'exists' => $exists,
                'is_writable' => $isWritable,
                'is_readable' => $isReadable,
                'is_link' => $isLink,
                'permissions' => $perms,
                'required' => $dir['required'],
                'status' => $status,
            ];
        }

        return $results;
    }

    /**
     * Helper to format bytes into human-readable strings.
     */
    protected function formatBytes(float|int $bytes, int $precision = 2): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision).' '.$units[$pow];
    }
}
