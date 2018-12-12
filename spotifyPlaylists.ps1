[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$header = @{}
$header.Add("Authorization", "Bearer BQAFWw9FWg77mvlN-BfCxl4Ymq_oSwhuu0hgVvCwZ8bibpSO6vxqUSAHdzi-EYUBplZO58VpWtcCjqJBA7azsPqFbYkaO7B_2rD6_l2tVWbBUKg__KGsjFvIZXjZwiUi4dEILLGcFv_oAhtDZevC3n5XPb5KHHPrhl30Fzly9A")
$listOfPlaylists = @()
$offset = 0
$looper = $true
$count = 0
while ($looper) {
    $response = Invoke-WebRequest "https://api.spotify.com/v1/users/12156513557/playlists?offset=$offset&limit=50" -Method Get -Headers $header
    $playlists = $response.Content | ConvertFrom-Json
    # $response
    $listOfPlaylists += ,$playlists.items
    if ($playlists.items.Count -eq 50) {
        $count += $playlists.items.Count
        $offset += 50
        $looper = $true
    }else{
        $count += $playlists.items.Count
        $looper = $false
    } 
}
foreach($playlist in $listOfPlaylists){
    $playlist.name
}
$count
