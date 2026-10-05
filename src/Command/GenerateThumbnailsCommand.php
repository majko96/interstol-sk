<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Finder\Finder;

#[AsCommand(
    name: 'app:generate-thumbnails',
    description: 'Generate resized JPEG thumbnails for project gallery photos into a thumbs/ subfolder next to each original.',
)]
class GenerateThumbnailsCommand extends Command
{
    private const MAX_DIMENSION = 800;
    private const JPEG_QUALITY = 78;

    public function __construct(private readonly ParameterBagInterface $parameters)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $baseDir = $this->parameters->get('kernel.project_dir') . '/public/images';

        $finder = new Finder();
        $finder->files()
            ->in($baseDir)
            ->name('/\.(jpe?g|png)$/i')
            ->exclude('thumbs');

        $generated = 0;
        $skipped = 0;

        foreach ($finder as $file) {
            $thumbDir = $file->getPath() . '/thumbs';
            $thumbPath = $thumbDir . '/' . pathinfo($file->getFilename(), PATHINFO_FILENAME) . '.jpg';

            if (is_file($thumbPath)) {
                $skipped++;
                continue;
            }

            if (!is_dir($thumbDir)) {
                mkdir($thumbDir, 0775, true);
            }

            if ($this->generateThumbnail($file->getRealPath(), $thumbPath)) {
                $generated++;
                $io->writeln(sprintf('  <info>✓</info> %s', substr($thumbPath, strlen($baseDir) + 1)));
            } else {
                $io->writeln(sprintf('  <error>✗ failed:</error> %s', $file->getRealPath()));
            }
        }

        $io->success(sprintf('Generated %d thumbnail(s), skipped %d already up to date.', $generated, $skipped));

        return Command::SUCCESS;
    }

    private function generateThumbnail(string $sourcePath, string $destPath): bool
    {
        $info = @getimagesize($sourcePath);
        if ($info === false) {
            return false;
        }

        [$width, $height, $type] = $info;

        $source = match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($sourcePath),
            IMAGETYPE_PNG => @imagecreatefrompng($sourcePath),
            default => false,
        };

        if ($source === false) {
            return false;
        }

        $source = $this->applyExifOrientation($source, $sourcePath, $type);
        $width = imagesx($source);
        $height = imagesy($source);

        $longestSide = max($width, $height);
        if ($longestSide > self::MAX_DIMENSION) {
            $scale = self::MAX_DIMENSION / $longestSide;
            $newWidth = (int) round($width * $scale);
            $newHeight = (int) round($height * $scale);
        } else {
            $newWidth = $width;
            $newHeight = $height;
        }

        $thumb = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $success = imagejpeg($thumb, $destPath, self::JPEG_QUALITY);

        imagedestroy($source);
        imagedestroy($thumb);

        return $success;
    }

    /**
     * @param resource|\GdImage $image
     * @return resource|\GdImage
     */
    private function applyExifOrientation($image, string $sourcePath, int $type)
    {
        if ($type !== IMAGETYPE_JPEG || !function_exists('exif_read_data')) {
            return $image;
        }

        $exif = @exif_read_data($sourcePath);
        $orientation = $exif['Orientation'] ?? 1;

        return match ($orientation) {
            3 => imagerotate($image, 180, 0),
            6 => imagerotate($image, -90, 0),
            8 => imagerotate($image, 90, 0),
            default => $image,
        };
    }
}
