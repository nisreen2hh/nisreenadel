$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5500/")
$listener.Start()
Write-Output "Server running at http://localhost:5500/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath
    if ($path -eq "/" -or $path -eq "") {
        $path = "/index.html"
    }

    $localPath = Join-Path "d:\antigravitypro2" ($path.TrimStart('/').Replace('/', '\'))

    if (Test-Path $localPath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($localPath)
        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()

        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".css"  { $response.ContentType = "text/css; charset=utf-8" }
            ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
            ".jpg"  { $response.ContentType = "image/jpeg" }
            ".png"  { $response.ContentType = "image/png" }
            ".svg"  { $response.ContentType = "image/svg+xml" }
            default { $response.ContentType = "application/octet-stream" }
        }

        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.OutputStream.Close()
}
